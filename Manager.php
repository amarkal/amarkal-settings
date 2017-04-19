<?php

namespace Amarkal\Settings;

class Manager
{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
    
    private $pages = array();
    
    private $subpages = array();
    
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
    
    public function add_page($args)
    {
        $slug = $args['slug'];
        if(array_key_exists($slug,$this->pages))
        {
            throw new \RuntimeException("A page with slug '$slug' has already been registered");
        }
        $this->pages[$slug] = new Page($args);
    }
    
    public function add_subpage($args)
    {
        $this->subpages[] = new SubPage($args);
    }
    
    public function register_settings()
    {
        register_setting( 'myoption-group', 'new_option_name' );
        register_setting( 'myoption-group', 'some_other_option' );
        register_setting( 'myoption-group', 'option_etc' );
    }
    
    /**
     * Register styles & scripts to be enqueued by settings subpages
     */
    public function register_scripts()
    {
        \wp_register_style('amarkal-settings',$this->get_url(__DIR__.'/assets/css/style.min.css'));
        \wp_register_script('amarkal-settings',$this->get_url(__DIR__.'/assets/js/script.min.js'));
    }
    
    /**
     * Private constructor to prevent instantiation
     */
    private function __construct() 
    {
        $this->init();
    }
    
    private function init()
    {
        \add_action('admin_init',array($this,'register_scripts'));
    }
    
    private function get_url( $path )
    {
        $url  = str_replace( ABSPATH, '', $path );
        return esc_url_raw( site_url( $url ) );
    }
}