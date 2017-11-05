const util = require('./util');
const parse = require('./parse');

/*
 * Monday Class
 */
class Monday {
    /*
     * Constructor
     * Object contains:
     * - document - name of file containing all info on user slides
     * - options - any set options
     * - filepath - file location
     * 
     * - intro_layout - layout for intro of presentation
     * - content_layout - layout for content of presentation
     * 
     * - style - currently only default
     * - script - pagination
     * 
     * - object of all slides
     */ 
    constructor(doc, options, filepath) {
        this.document = doc.toString();
        this.options = options || {};
        this.filepath = filepath || '.';

        this.templates = {
            layout: 'templates/layout.pug',
            slides: 'templates/default.pug'
        }

        this.resources = {
            style: 'resources/default.css',
            script: 'resources/script.js'
        }

        this.external = {
            style: []
        }

        this.slides = [];
    };
    /*
     * Render the slides
     * make a object for each slide
     * 
     */
    loadDoc() {
        return Promise.all([
            helper.loadMap(this.external, { external: true }),
            helper.loadMap(this.templates)
        ]);;
    };

    /*
     * render slides into objects from slide parser
     */ 
    renderSlides() {
        
        slide_data = parse.parseSlides(this.document);
        for (let i = 1; i < slide_data.length; i++) {
            this.slides.push({
                id: i,
                hidden: i !== 1,
                content = slide_data[i]
            })
        }
        return Promise.resolve(true);
    }

    populate

    // loadDocument -> render slides -> populate
    run() {
        const self = this;
        const docChain = this.loadDoc() // load all the documents
            .then(self.renderSlides.bind(self)) // render slides from documents

        return docChain;
    }
}

module.exports = Monday;