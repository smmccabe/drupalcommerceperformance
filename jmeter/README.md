# Drupal Commerce jMeter

A jmeter template for performance testing against a Drupal 8 site. Will test the checkout flow up to but not including order completion, browses a couple pages before checking out and tries to simulate real user behavior and timing.

# Requirements

jMeter 5 or greater

# Usage

You will need to edit the script and replace the URLs with ones for your site, there are only a few an variables are used where possible to make it simpler.

Editing
`jmeter -t drupalcommerce8.jmx`

It is recommended to run anything other than a quick "does this work" test via the command line and not the gui

Running
`./jmeter -n -t ~/Dev/gitlab/acro-performance/jmeter/drupalcommerce.jmx -l results -e -o report`
