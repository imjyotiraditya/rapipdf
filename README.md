# RapiPDF Web Interface

[![Website](https://img.shields.io/badge/Open-Website-blue?style=for-the-badge)](https://jyotiraditya.dev/rapipdf/)

A modern web interface for generating PDF documentation from OpenAPI/Swagger specifications using RapiPDF. This tool provides an intuitive UI for converting API specifications into beautifully formatted PDF documents with extensive customization options.

## Features

- Multiple input methods:
  - Direct URL input
  - File upload (supports drag & drop)
  - Text input with JSON/YAML support
- Format conversion and validation:
  - Automatic JSON ↔ YAML conversion
  - Content formatting and validation
  - Support for both JSON and YAML file uploads
- Customizable PDF output:
  - Content sections toggle
  - Color scheme customization
  - Text content customization
  - Schema style options
- Dark theme interface
- Responsive design

## Usage

### URL Method
1. Enter the URL of your OpenAPI/Swagger specification in the input field
2. Click "GENERATE PDF" to create the documentation

### File Upload Method
1. Click the "File Upload" tab
2. Either drag and drop your specification file or click to select one
3. Supported formats: `.json`, `.yaml`, `.yml`
4. The file will be automatically processed and loaded

### Text Input Method
1. Click the "Paste Content" tab
2. Paste your OpenAPI/Swagger specification
3. Select the format (JSON or YAML)
4. Use the "Format" button to prettify the content
5. Click "Load Content" to process the specification

### Customization Options

#### Content Options
- API Information
- Table of Contents
- Security Section
- Examples
- API Details
- API List
- Tag Sorting

#### Style Options
- Schema Style (Table/Object)
- Primary Color
- Alternate Color

#### Text Content
- PDF Title
- Cover Text
- Security Text
- API Text
- Footer Text

## Dependencies

- [RapiPDF](https://github.com/mrin9/RapiPdf)
- [js-yaml](https://github.com/nodeca/js-yaml)

## Browser Compatibility

Supports all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Acknowledgments

- Built with [RapiPDF](https://github.com/mrin9/RapiPdf)
- YAML processing by [js-yaml](https://github.com/nodeca/js-yaml)
