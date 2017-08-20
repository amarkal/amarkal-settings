<?php

namespace Amarkal\Settings;

class Manager
{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
        
    /**
     * @var array The list of registered settings pages
     */
    private $settings_pages = array();
    
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
    public function add_settings_page( $args )
    {
        $slug = $args['slug'];
        if(array_key_exists($slug,$this->settings_pages))
        {
            throw new \RuntimeException("A settings page with slug '$slug' has already been registered");
        }
        $page = new SettingsPage($args);
        $this->settings_pages[$slug] = $page;
        return $page;
    }
    
    /**
     * Get a settings page from the list of registered settings pages.
     * 
     * @param string $slug
     * @param string $parent_slug
     * @return SettingsPage
     * @throws \RuntimeException If no settings page was found for the given slug/parent_slug
     */
    public function get_settings_page( $slug )
    {
        if(!array_key_exists($slug, $this->settings_pages))
        {
            throw new \RuntimeException("The settings page '$slug' does not exist");
        }
        return $this->settings_pages[$slug];
    }
    
    /**
     * Register styles & scripts to be enqueued by settings pages
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