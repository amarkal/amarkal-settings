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
        \add_action('wp_ajax_amarkal_settings_save', array( $this, 'save_settings'));
        \add_action('wp_ajax_amarkal_settings_reset', array( $this, 'reset_settings'));
    }
    
    public function save_settings()
    {
        $this->set_request_data();
        $child_page  = $this->get_request_child_page();
        
        \wp_send_json($child_page->update($this->request_data));
    }
    
    public function reset_settings()
    {
        $this->set_request_data();
        $child_page = $this->get_request_child_page();
        
        \wp_send_json($child_page->reset());
    }
    
    private function get_request_child_page()
    {
        $manager     = Manager::get_instance();
        $slug        = $this->request_data['_amarkal_settings_slug'];
        $parent_slug = $this->request_data['_amarkal_settings_parent_slug'];
        
        return $manager->get_child_page($slug, $parent_slug);
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