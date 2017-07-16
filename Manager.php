<?php

namespace Amarkal\Settings;

class Manager
{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
    
    private $pages = array();
    
    private $child_pages = array();
    
    /**
     * Returns the *Singleton* instance of this class.
     *
     * @return Singleton The *Singleton* instance.
     */
    public static function get_instance()
    {
        if( null === static::$instance ) 
        {
            static::$instance = new static();
        }
        return static::$instance;
    }
    
    /**
     * Add a page to the admin menu.
     * 
     * @param array $args
     * @throws \RuntimeException
     */
    public function add_page($args)
    {
        $slug = $args['slug'];
        if(array_key_exists($slug,$this->pages))
        {
            throw new \RuntimeException("A page with slug '$slug' has already been registered");
        }
        $this->pages[$slug] = new Page($args);
    }
    
    /**
     * Get a page from the set of registered pages.
     * 
     * @param string $slug
     * @return Page
     * @throws \RuntimeException If no page was found for the given slug
     */
    public function get_page($slug)
    {
        if(!array_key_exists($slug,$this->pages))
        {
            throw new \RuntimeException("The page '$slug' does not exist");
        }
        return $this->pages[$slug];
    }
    
    /**
     * Add a child setting page.
     * 
     * @param array $args
     */
    public function add_child_page($args)
    {
        $parent_slug = $args['parent_slug'];
        if(!array_key_exists($parent_slug, $this->child_pages))
        {
            $this->child_pages[$parent_slug] = array();
        }
        $this->child_pages[$parent_slug][$args['slug']] = new ChildPage($args);
    }
    
    /**
     * Get a child page from the set of registered child pages.
     * 
     * @param string $slug
     * @param string $parent_slug
     * @return ChildPage
     * @throws \RuntimeException If no child page was found for the given slug/parent_slug
     */
    public function get_child_page($slug, $parent_slug)
    {
        if(!array_key_exists($parent_slug, $this->child_pages) ||
           !array_key_exists($slug, $this->child_pages[$parent_slug]))
        {
            throw new \RuntimeException("The child page '$slug' does not exist for the parent '$parent_slug'");
        }
        return $this->child_pages[$parent_slug][$slug];
    }

    /**
     * Get the value of the given field.
     *
     * @param [string] $field_name
     * @return mixed
     */
    public function get_field_value($field_name)
    {
        foreach($this->child_pages as $parent_slug => $child_pages)
        {
            try
            {
                return $this->get_field_value_for_parent($parent_slug, $field_name);
            }
            catch(\RuntimeException $e)
            {
                continue;
            }
        }

        \trigger_error("Can't find a component with the name <b>$field_name</b>");
    }

    /**
     * Get the value of a field within a parent page.
     *
     * @param [string] $parent_slug
     * @param [string] $field_name
     * @throws RuntimeException if no field was found with the given name
     * @return mixed
     */
    public function get_field_value_for_parent($parent_slug, $field_name)
    {
        foreach($this->child_pages[$parent_slug] as $cp)
        {
            try 
            {
                $component = $cp->get_component($field_name);
                $value = \get_option($field_name, $component->default);
                return $value;
            }
            catch(\RuntimeException $e)
            {
                continue;
            }
        }
        throw new \RuntimeException("Can't find a component with the name <b>$field_name</b>");
    }
    
    /**
     * Register styles & scripts to be enqueued by settings child pages
     */
    public function register_scripts()
    {
        \wp_register_style('amarkal-settings', \Amarkal\Core\Utility::path_to_url(__DIR__.'/assets/css/dist/amarkal-settings.min.css'));
        \wp_register_script('amarkal-settings',\Amarkal\Core\Utility::path_to_url(__DIR__.'/assets/js/dist/amarkal-settings.min.js'),array('amarkal-ui'));
    }
    
    /**
     * Private constructor to prevent instantiation
     */
    private function __construct() 
    {
        $this->init();
    }
    
    /**
     * Register scripts and initiate the request handler.
     */
    private function init()
    {
        \add_action('admin_init',array($this,'register_scripts'));
        
        $rh = RequestHandler::get_instance();
        $rh->init();
    }
}