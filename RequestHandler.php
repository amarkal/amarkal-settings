<?php

namespace Amarkal\Settings;

class RequestHandler
{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
    
    private $request_data = array();
    
    const NONCE_ACTION = 'amarkal_settings';
    
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
    
    public function init()
    {
        \add_action('wp_ajax_amarkal_settings_save', array( $this, 'action_save'));
        \add_action('wp_ajax_amarkal_settings_reset_all', array( $this, 'action_reset_all'));
        \add_action('wp_ajax_amarkal_settings_reset_section', array( $this, 'action_reset_section'));
    }
    
    public function action_save()
    {
        $this->set_request_data();
        $settings_page  = $this->get_request_settings_page();
        
        \wp_send_json($settings_page->update($this->request_data));
    }
    
    public function action_reset_all()
    {
        $this->set_request_data();
        $settings_page = $this->get_request_settings_page();
        
        \wp_send_json($settings_page->reset());
    }

    public function action_reset_section()
    {
        $this->set_request_data();
        $settings_page = $this->get_request_settings_page();
        $section       = $this->request_data['_amarkal_settings_section'];
        
        \wp_send_json($settings_page->reset_section($section));
    }
    
    private function get_request_settings_page()
    {
        $manager    = Manager::get_instance();
        $slug       = $this->request_data['_amarkal_settings_slug'];
        
        return $manager->get_settings_page($slug);
    }
    
    private function set_request_data()
    {
        $this->request_data = filter_input(INPUT_POST,'data',FILTER_DEFAULT,FILTER_REQUIRE_ARRAY);
        $nonce = $this->request_data['_amarkal_settings_nonce'];

        if( !isset( $nonce ) ||
            !\wp_verify_nonce($nonce, self::NONCE_ACTION) ) 
        {
            \wp_send_json(array(
                'values' => array(),
                'errors' => array(
                    'Your nonce did not verify'
                )
            ));
        }
    }
}