<?php

namespace Amarkal\Settings;

/**
 * Implements a settings child page.
 * Child pages are pages that appear and their parent's submenu (unless there is
 * only one child, in which case the child page handles the parent page HTML output).
 */
class ChildPage
{   
    /**
     * @var array Configuration array 
     */
    private $config;
    
    /**
     * @var Amarkal\UI\Form The UI form instance
     */
    private $form;
    
    /**
     * Set the config, create a form instance and add actions.
     * 
     * @param array $config
     */
    public function __construct( array $config = array() ) 
    {
        $this->config = array_merge($this->default_args(), $config);
        $this->form = new \Amarkal\UI\Form($this->config['fields']);
        
        \add_action('admin_menu', array($this,'add_submenu_page'));
        \add_action('admin_enqueue_scripts', array($this,'enqueue_scripts'));
    }
    
    /**
     * Internally used to add a submenu page for this child page
     */
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
    
    /**
     * Conditionally enqueue settings scripts and styles if the calling page is
     * a settings page.
     */
    public function enqueue_scripts()
    {
        // Only enqueue styles & scripts if this is a settings page
        if($this->config['slug'] === filter_input(INPUT_GET, 'page'))
        {
            \wp_enqueue_style('amarkal-settings');
            \wp_enqueue_script('amarkal-settings');
        }
    }
    
    /**
     * Render the settings page
     */
    public function render()
    {
        $this->form->update($this->get_old_instance());
        include __DIR__.'/ChildPage.phtml';
        \add_filter('admin_footer_text', array($this, 'footer_credits'));
    }
    
    /**
     * Ajax callback internally used to update options values for the given 
     * settings page.
     * 
     * @param array $new_instance
     * @return array
     */
    public function update( $new_instance )
    {
        if($this->can_update())
        {
            $old_instance = $this->get_old_instance();
            $final_instance = $this->form->update($new_instance, $old_instance);
            foreach($final_instance as $name => $value)
            {
                \update_option($name,$value);
            }
            return $this->results_array(
                $this->get_errors(),
                $final_instance
            );
        }
        return $this->results_array(
            array("You don't have permission to manage options on this site")
        );
    }
    
    /**
     * Ajax callback internally used to reset all component values to their 
     * defaults for the given settings page.
     * 
     * @return type
     */
    public function reset()
    {
        if($this->can_update())
        {
            foreach($this->config['fields'] as $field)
            {
                \delete_option($field['name']);
            }
            return $this->results_array(
                array(),
                $this->form->reset()
            );
        }
        return $this->results_array(
            array("You don't have permission to manage options on this site")
        );
    }
    
    /**
     * Renders Amarkal's credits on the page's footer.
     */
    public function footer_credits()
    {
        echo '<span id="footer-thankyou">Created with <a href="https://github.com/askupasoftware/amarkal-settings">amarkal-settings</a>, a module within the <a href="https://github.com/askupasoftware/amarkal">Amarkal Framework</a></span>';
    }

    /**
     * Get the component corresponding to the given name
     *
     * @param [string] $name
     * @throws RuntimeException when the component cannot be found
     * @return void
     */
    public function get_component($name)
    {
        return $this->form->get_component($name);
    }
    
    /**
     * Get all errors from the form instance.
     * 
     * @return array
     */
    private function get_errors()
    {
        $errors = array();
        foreach($this->form->get_errors() as $name => $error)
        {
            $errors[$name] = $error;
        }
        return $errors;
    }
    
    /**
     * Generates a results array to be returned when an Ajax request is made.
     * 
     * @param array $errors The list of errors
     * @param array $values The list of values
     * @return array
     */
    private function results_array( $errors = array(), $values = '' )
    {
        return array(
            'values' => $values,
            'errors' => $errors
        );
    }
    
    /**
     * Check if the current user has the required privileges to update the 
     * settings values.
     * 
     * @return boolean
     */
    private function can_update()
    {
        return \current_user_can($this->config['capability']);
    }
    
    /**
     * Get the old instance from the database.
     * 
     * @return array
     */
    private function get_old_instance()
    {
        $old_instance = array();
        foreach($this->form->get_components() as $component)
        {
            $old_instance[$component->name] = \get_option($component->name, $component->default);
        }
        return $old_instance;
    }
    
    /**
     * The default config arguments array.
     * 
     * @return array
     */
    private function default_args()
    {
        return array(
            'parent_slug'    => '',
            'slug'           => '',
            'title'          => '',
            'subtitle'       => '',
            'menu_title'     => '',
            'capability'     => 'manage_options',
            'footer_html'    => '',
            'subfooter_html' => '',
            'description'    => null,
            'fields'         => array()
        );
    }
}