<?php

namespace Amarkal\Settings;

class Page
{   
    private $config;
    
    public function __construct( array $args = array() ) 
    {
        $this->config = array_merge($this->default_args(), $args);
        
        \add_action('admin_menu', array($this,'add_menu_page'));
    }
    
    public function add_menu_page()
    {
        \add_menu_page(
            $this->config['title'], 
            $this->config['menu_title'], 
            $this->config['capability'], 
            $this->config['slug'], 
            null, // Create a child page with the parent_slug set to this page's slug
            $this->config['icon'],
            $this->config['position']
        );
    }
    
    private function default_args()
    {
        return array(
            'slug'       => '',
            'title'      => '',
            'menu_title' => '',
            'icon'       => '',
            'position'   => 10,
            'capability' => 'manage_options'
        );
    }
}