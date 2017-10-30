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

        this.intro_layout = 'templates/intro_layout.pug';
        this.content_layout = 'templates/content_layout.pug';

        this.style = 'styles/default.css';
        this.script = 'paging.js';

        this.slides = [];
    };
    /*
     * Render the slides
     * make a object for each slide
     * 
     */
    loadDoc() {
        return util.loadPromise(this.document);
    };

    renderSlides(slide_data) {
        return parse.parseSlides(slide_data);
    }
    // loadDocument -> render slides -> populate
    run() {
        const docChain = this.loadDoc()
            .then(this.renderSlides.bind(this))
            .then()
            
    }





}