<?php
/**
 * WolfPack Custom Post Types & GraphQL Registration
 *
 * Drop this file into your theme's functions.php or use as a mu-plugin:
 *   wp-content/mu-plugins/wolfpack-cpt.php
 *
 * Required plugins:
 *   - WPGraphQL
 *   - ACF PRO
 *   - WPGraphQL for ACF
 */

add_action('init', 'wolfpack_register_post_types');

function wolfpack_register_post_types() {

    // ──────────────────────────────────────
    // Services
    // ──────────────────────────────────────
    register_post_type('service', [
        'labels' => [
            'name'               => 'Services',
            'singular_name'      => 'Service',
            'add_new'            => 'Add New Service',
            'add_new_item'       => 'Add New Service',
            'edit_item'          => 'Edit Service',
            'new_item'           => 'New Service',
            'view_item'          => 'View Service',
            'search_items'       => 'Search Services',
            'not_found'          => 'No services found',
            'not_found_in_trash' => 'No services found in trash',
            'all_items'          => 'All Services',
            'menu_name'          => 'Services',
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'services', 'with_front' => false],
        'menu_icon'           => 'dashicons-briefcase',
        'menu_position'       => 5,
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'service',
        'graphql_plural_name' => 'services',
    ]);

    // ──────────────────────────────────────
    // Case Studies
    // ──────────────────────────────────────
    register_post_type('case-study', [
        'labels' => [
            'name'               => 'Case Studies',
            'singular_name'      => 'Case Study',
            'add_new'            => 'Add New Case Study',
            'add_new_item'       => 'Add New Case Study',
            'edit_item'          => 'Edit Case Study',
            'new_item'           => 'New Case Study',
            'view_item'          => 'View Case Study',
            'search_items'       => 'Search Case Studies',
            'not_found'          => 'No case studies found',
            'not_found_in_trash' => 'No case studies found in trash',
            'all_items'          => 'All Case Studies',
            'menu_name'          => 'Case Studies',
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'case-studies', 'with_front' => false],
        'menu_icon'           => 'dashicons-analytics',
        'menu_position'       => 6,
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'caseStudy',
        'graphql_plural_name' => 'caseStudies',
    ]);

    // ──────────────────────────────────────
    // Team Members
    // ──────────────────────────────────────
    register_post_type('team-member', [
        'labels' => [
            'name'               => 'Team Members',
            'singular_name'      => 'Team Member',
            'add_new'            => 'Add New Team Member',
            'add_new_item'       => 'Add New Team Member',
            'edit_item'          => 'Edit Team Member',
            'new_item'           => 'New Team Member',
            'view_item'          => 'View Team Member',
            'search_items'       => 'Search Team Members',
            'not_found'          => 'No team members found',
            'not_found_in_trash' => 'No team members found in trash',
            'all_items'          => 'All Team Members',
            'menu_name'          => 'Team',
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'team', 'with_front' => false],
        'menu_icon'           => 'dashicons-groups',
        'menu_position'       => 7,
        'supports'            => ['title', 'editor', 'thumbnail', 'revisions'],
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'teamMember',
        'graphql_plural_name' => 'teamMembers',
    ]);
}
