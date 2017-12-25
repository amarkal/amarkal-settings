# amarkal-settings [![Build Status](https://scrutinizer-ci.com/g/amarkal/amarkal-settings/badges/build.png?b=master)](https://scrutinizer-ci.com/g/amarkal/amarkal-settings/build-status/master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/amarkal/amarkal-settings/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/amarkal/amarkal-settings/?branch=master) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/) [![Amarkal Powered](https://askupasoftware.com/amarkal-powered.svg)](https://products.askupasoftware.com/amarkal) [![License](https://img.shields.io/badge/license-GPL--3.0%2B-red.svg)](https://raw.githubusercontent.com/amarkal/amarkal-settings/master/LICENSE)
Add setting pages with [amarkal-ui](https://github.com/amarkal/amarkal-ui) components to your WordPress theme or plugin.

**Tested up to:** WordPress 4.8  
**Dependencies**: *[amarkal-core](https://github.com/amarkal/amarkal-core)*, *[amarkal-ui](https://github.com/amarkal/amarkal-ui)*

![amarkal-settings](https://askupasoftware.com/wp-content/uploads/2015/04/amarkal-settings.png)

## overview

**amarkal-settings** lets you create setting pages for your theme or plugin, based on [amarkal-ui](https://github.com/amarkal/amarkal-ui) components. Setting pages store data as options in the database, and use AJAX to store the data asynchronously to improve user experience.

## Installation

### Via Composer

If you are using the command line:  
```
$ composer require askupa-software/amarkal-settings:dev-master
```

Or simply add the following to your `composer.json` file:
```javascript
"require": {
     "askupa-software/amarkal-settings": "dev-master"
 }
```
And run the command 
```
$ composer install
```

This will install the package in the directory `vendors/askupa-software/amarkal-settings`.  
Now all you need to do is include the composer autoloader.

```php
require_once 'path/to/vendor/autoload.php';
```

### Manually

Download [amarkal-core](https://github.com/amarkal/amarkal-core/archive/master.zip), [amarkal-ui](https://github.com/amarkal/amarkal-ui/archive/master.zip) and [amarkal-settings](https://github.com/amarkal/amarkal-settings/archive/master.zip) from github and include them in your project.

```php
require_once 'path/to/amarkal-core/bootstrap.php';
require_once 'path/to/amarkal-ui/bootstrap.php';
require_once 'path/to/amarkal-settings/bootstrap.php';
```

## Adding Setting Pages

A Setting page is a graphical user interface (based on amarkal-ui) that provides a convenient way for your users to store and retrieve options for your theme/plugin. A setting page is presented in the admin menu as a child page to an existing top level menu item.

### Adding a settings page

The following example shows how to add settings page that will be available under the 'Tools' submenu.

```php
$page = amarkal_add_settings_page(array(
    'slug'         => 'my-settings-page',
    'parent_slug'  => 'tools.php', // The 'Tools' top level menu item slug
    'title'        => 'My Settings',
    'menu_title'   => 'My Settings'
));
```

Now you can use the returned instance to add settings fields. Any Amarkal UI component can be used as a field.

```php
$page->add_field(array(
    'type'       => 'text',
    'default'    => 'Default text...',
    'title'      => 'My Text',
    'name'       => 'my-text'
));
```

### Adding a section to a settings page

You can also divide your settings into sections, to better organize them and make it easier for the user to find what he is looking for.

>> When you add one or more sections, a sidebar will appear with all the added section names, as well as a search box to search for a settings field in all the sections.

```php
$page->add_section(array(
    'slug'         => 'my-section', // Must be unique within the list of sections for this page
    'title'        => 'My Section'
));

// Make sure to add a 'section' argument to fields to associate them with a given section
$page->add_field(array(
    'section'    => 'my-section',
    'type'       => 'text',
    'default'    => 'Default text...',
    'title'      => 'My Text',
    'name'       => 'my-text'
));
```

### Retrieving a settings field value

You can retrieve the value of a certain field by its name, and the slug of the page in which it is registered.

>> This method checks the database first, and if nothing is found, it will return the field's default value.

```php
$value = amarkal_get_settings_value('my-settings-page', 'my-text');
```

## Reference

### amarkal_add_settings_page
*Add a settings page.*
```php
amarkal_add_settings_page( $args )
```
This function is used to create a settings page in WordPresss admin section. Once created, a menu item will be added to the submenu of the parent slug given in `'parent_slug'`.

>> If you want to create a top-level settings page, you need to create a menu page using `add_menu_page()`, and then set the settings page's `'parent_slug'` to the slug of the top-level menu page that you've created.

**Parameters**  
* `$args` (*Array*)  The list of page arguments. Acceptable arguments are:
  * `parent_slug` (*String*) The slug name for the parent menu (or the file name of a standard WordPress admin page).
  * `slug` (*String*) The slug name to refer to this menu by (should be unique for this menu).
  * `title` (*String*) The text to be displayed in the title tags of the page when it is displayed.
  * `subtitle` (*String*) The text to be displayed below the title at the top part of the page.
  * `menu_title` (*String*) The text to be used for the menu.
  * `capability` (*String*) The capability required for this menu to be displayed to the user. Used to determine whether or not a page is included in the menu.
  * `footer_html` (*String*) Specifies the HTML to be printed at the footer of the  settings page.
  * `subfooter_html` (*String*) Specifies the HTML to be printed below footer of the  settings page.

**Return Value**  
(*Amarkal\Settings\SettingsPag*) The instance of the settings page

**Example Usage**
```php
amarkal_add_settings_page(array(
    'parent_slug'  => 'tools.php',
    'slug'         => 'my-settings-page',
    'title'        => 'My Settings',
    'menu_title'   => 'My Settings',
    'capability'   => 'manage_options'
));
```

### amarkal_get_settings_page
*Get the instance of a settings page.*
```php
amarkal_get_settings_page( $slug )
```
This function is used to get the instance of a reigstered settings page by its slug.

**Parameters**  
* `slug` (*String*) The slug name of the settings page

**Return Value**  
(*Amarkal\Settings\SettingsPage*) The instance of the settings page

**Example Usage**
```php
$page = amarkal_get_settings_page('my-settings-page');
```

### amarkal_get_settings_value
*Get the value of the given field.*
```php
amarkal_get_settings_value( $slug, $field_name )
```
This function is used to retrieve the value of a given field. If no value exists in the database, the default value will be returned. This function makes a call to `get_option()` internally, providing the default value of the field as the second argument.

**Parameters**  
* `$slug` (*String*) The slug of the settings page to which this field belongs
* `$field_name` (*String*)  The name of the field.

**Return Value**  
(*Mixed*) The value of the given field.

**Example Usage**
```php
$value = amarkal_get_settings_value('my-settings','my-text');
```

### amarkal_get_settings_values
*Get all the values for the given settings page as an array.*
```php
amarkal_get_settings_values( $slug )
```
This function is used to retrieve all the value of a given settings page. If no value exists in the database, the default values will be returned. This function makes a call to `get_option()` internally, providing the default value of the field as the second argument.

**Parameters**  
* `$slug` (*String*) The slug of the settings page of which the values are to be retrieved.

**Return Value**  
(*Array*) The list of all field values

**Example Usage**
```php
$values = amarkal_get_settings_values('my-settings');
```