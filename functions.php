<?php
/**
 * WordPress Settings
 *
 * Add setting pages with Amarkal UI components to your WordPress theme or 
 * plugin.
 *
 * @package   amarkal-settings
 * @depends   amarkal-ui
 * @author    Askupa Software <hello@askupasoftware.com>
 * @link      https://github.com/askupasoftware/amarkal-settings
 * @copyright 2017 Askupa Software
 */

// Prevent direct file access
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Prevent loading the library more than once
 */
if( defined( 'AMARKAL_SETTINGS' ) ) return false;
define( 'AMARKAL_SETTINGS', true );

if(!function_exists('amarkal_add_settings_page'))
{
    /**
     * Add a new settings page
     *
     * @param [array] $args
     * @return void
     */
    function amarkal_add_settings_page( $args )
    {
        $manager = Amarkal\Settings\Manager::get_instance();
        return $manager->add_settings_page($args);
    }
}

if(!function_exists('amarkal_get_settings_page'))
{
    /**
     * Get a settings page instance
     *
     * @param string $slug
     * @return Amarkal\Settings\SettingsPage
     */
    function amarkal_get_settings_page( $slug )
    {
        $manager = Amarkal\Settings\Manager::get_instance();
        return $manager->get_settings_page($slug);
    }
}

if(!function_exists('amarkal_get_settings_value'))
{
    /**
     * Get the value of the given settings field
     *
     * @param [array] $args
     * @return void
     */
    function amarkal_get_settings_value( $slug, $field_name )
    {
        $manager = Amarkal\Settings\Manager::get_instance();
        $page = $manager->get_settings_page($slug);
        return $page->get_field_value($field_name);
    }
}