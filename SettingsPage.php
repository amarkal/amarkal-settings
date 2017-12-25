<?php

namespace Amarkal\Settings;

/**
 * Implements a settings page.
 */
class SettingsPage
{   
    /**
     * Configuration array 
     * 
     * @var array 
     */
    private $config;
    
    /**
     * The UI form instance
     * 
     * @var Amarkal\UI\Form 
     */
    private $form;

    /**
     * The list of arguments for each section 
     *
     * @var array
     */
    private $sections;

    /**
     * The list of fields for the entire settings page
     *
     * @var Amarkal\UI\ComponentList
     */
    private $fields;

    /**
     * An instance of the current field values (either the from the database, or the defaults)
     *
     * @var array
     */
    private $values;
    
    /**
     * Set the config, create a form instance and add actions.
     * 
     * @param array $config
     */
    public function __construct( array $config = array() ) 
    {
        $this->config   = array_merge($this->default_args(), $config);
        $this->fields   = new \Amarkal\UI\ComponentList();
        $this->sections = array();
        $this->form     = new \Amarkal\UI\Form($this->fields);
        
        \add_action('admin_menu', array($this,'add_submenu_page'));
        \add_action('admin_enqueue_scripts', array($this,'enqueue_scripts'));
    }

    /**
     * Add a section to this settings page
     *
     * @param array $args
     * @return void
     */
    public function add_section( array $args )
    {
        $args = \array_merge($this->default_section_args(), $args);
        $slug = $args['slug'];
        if(array_key_exists($slug, $this->sections))
        {
            throw new \RuntimeException("A section with '$slug' has already been created for this page.");  
        }
        $this->sections[$slug] = $args;
    }

    /**
     * Add a settings field to this settings page
     *
     * @param array $args
     * @return void
     */
    public function add_field( array $args )
    {
        $this->fields->add_component($args);
    }

    /**
     * Get the current values for all fields from the database, or the default values if none exists
     *
     * @return array
     */
    public function get_field_values()
    {
        if(!isset($this->values))
        {
            $this->values = array_merge($this->form->reset(), $this->get_old_instance());
        }
        return $this->values;
    }

    /**
     * Get the value of the given field from the database, or the default value if none exists
     *
     * @param string $name
     * @return any
     */
    public function get_field_value( $name )
    {
        $values = $this->get_field_values();
        return $values[$name];
    }
    
    /**
     * Internally used to add a submenu page for this settings page
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
        include __DIR__.'/SettingsPage.phtml';
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
            $this->values = $this->form->update($new_instance, $old_instance);
            
            \update_option($this->config['slug'], $this->values);

            return $this->results_array(
                $this->get_errors(),
                $this->values
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
            \delete_option($this->config['slug']);
            $this->values = $this->form->reset();

            return $this->results_array(
                array(),
                $this->values
            );
        }
        return $this->results_array(
            array("You don't have permission to manage options on this site")
        );
    }

    /**
     * Ajax callback internally used to reset all component values to their 
     * defaults for the given settings section.
     *
     * @param string $slug
     * @return void
     */
    public function reset_section( $slug ) 
    {
        if($this->can_update())
        {
            $old_instance = $this->get_old_instance();
            $final_instance = $this->form->reset_components($this->get_section_fields($slug));
            
            // Array merge is needed in order not to delete fields from other sections
            // since the $final_instance only contains the fields that were reset
            $this->values = array_merge($old_instance, $final_instance);
            \update_option($this->config['slug'], $this->values);

            return $this->results_array(
                array(),
                $this->values
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
        echo '<span id="footer-thankyou">Created with <a href="https://github.com/amarkal/amarkal-settings">amarkal-settings</a>, a module within the <a href="https://github.com/amarkal/">Amarkal Framework</a></span>';
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
        return $this->form->get_component_list()->get_by_name($name);
    }

    /**
     * Get all the fields for the given section
     *
     * @param string $slug
     * @return array
     */
    private function get_section_fields($slug)
    {
        $fields = array();
        foreach($this->fields->get_all() as $c)
        {
            if($c->section === $slug)
            {
                $fields[] = $c;
            }
        }
        return $fields;
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
        return \get_option($this->config['slug'], array());
    }
    
    /**
     * The default config arguments array for a page.
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
            'subfooter_html' => ''
        );
    }

    /**
     * The default config arguments array for a section.
     *
     * @return void
     */
    private function default_section_args()
    {
        return array(
            'slug'           => '',
            'title'          => '',
            'subtitle'       => ''
        );
    }
}