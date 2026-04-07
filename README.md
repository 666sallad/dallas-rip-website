# dallas.rip Website

This README provides a comprehensive overview of the dallas.rip website project, intended for both human developers and AI agents to understand its architecture, logic, and how to navigate the codebase.

## Project Overview

This project is a personal portfolio website for dallas.rip. It features a retro-futuristic "cyber" theme with a "monitor bezel" design, an interactive particle background, and a typing effect in the header. The website is a static site, with content managed through Markdown files and a simple build script to generate JSON data.

## How it Works

The website is built using a combination of static HTML, JavaScript for dynamic components and interactivity, and a Node.js build script for content processing.

### Static Site Generation

The core of the content management system is the `build.js` script. This script reads Markdown files from the `_photography` and `_videography` directories, parses the front-matter from each file using the `gray-matter` library, and then generates `_photography.json` and `_videography.json` files respectively. These JSON files contain an array of objects, where each object represents the front-matter data from a Markdown file. This allows the website to dynamically display content from the Markdown files without needing a complex backend or database.

### Component-based Structure

The website uses a component-based approach for the header and footer.

*   `header.js`: This script dynamically injects a header into the page. The header includes a "hamburger" menu icon that toggles a full-screen navigation overlay. The script is self-contained, with its own CSS and event listeners.
*   `footer.js`: This script injects a footer with navigation links and contact information. It also includes a fade-in animation.

These component scripts are loaded into placeholder `<div>` elements (`<div id="global-header">` and `<div id="global-footer">`) in the HTML files.

### Styling

The website's visual appearance is controlled by `global.css`. This file contains all the styles for the retro "monitor bezel" theme, typography, and layout.

### Interactive Canvas Background

The homepage features an interactive background created with `canvas.js`. This script generates a particle animation on an HTML `<canvas>` element. The particles react to mouse movement and clicks, creating a dynamic and engaging user experience.

## Pages

The website consists of several HTML pages:

*   `index.html`: The main landing page, featuring the interactive canvas and primary navigation.
*   `about.html`: A page with information about the site's owner.
*   `contact.html`: A page with contact information.
*   `photography.html`, `videography.html`, `websites.html`, `advertising.html`: Service-specific pages that likely display the content generated from the `_photography` and `_videography` directories.

## Content Management

Content for the photography and videography sections is managed through Markdown files in the `_photography` and `_videography` directories. Each Markdown file should contain a front-matter section with the necessary metadata (e.g., title, date, image URL).

The `admin/config.yml` file suggests that a headless CMS, such as Netlify CMS, may have been used at some point to manage the content in these directories.

## Build Process

To generate the content JSON files, run the following command in your terminal:

```bash
npm install
npm run build
```

This will execute the `build.js` script and create or update the `_photography.json` and `_videography.json` files.

## Dependencies

The project has one main dependency:

*   `gray-matter`: A library for parsing front-matter from files.
