<?php

namespace Amarkal\Settings;

class SubPage
{   
    private $config;
    
    private $form;
    
    public function __construct( array $args = array() ) 
    {
        $this->config = array_merge($this->default_args(), $args);
        $this->form = new \Amarkal\UI\Form($this->config['fields']);
        
        \add_action('admin_menu', array($this,'add_submenu_page'));
        \add_action('admin_enqueue_scripts', array($this,'enqueue_scripts'));
    }
    
    public function add_submenu_page()
    {
        \add_submenu_page(
            $this->config['parent_slug'], 
            $this->config['title'], 
            $this->config['menu_title'], 
            $this->config['capability'],
            $this->config['slug'],
            array($this, 'render')
        );
    }
    
    public function enqueue_scripts()
    {
        // Only enqueue styles & scripts if this is a settings page
        if($this->config['slug'] === filter_input(INPUT_GET, 'page'))
        {
            \wp_enqueue_style('amarkal-settings');
        }
    }
    
    public function render()
    {
        $this->form->update();
        include __DIR__.'/SubPage.phtml';
    }
    
    private function default_args()
    {
        return array(
            'parent_slug' => '',
            'slug'        => '',
            'title'       => '',
            'menu_title'  => '',
            'capability'  => 'manage_options'
        );
    }
}