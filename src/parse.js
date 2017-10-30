/*
 * Helper functions for parseSlides
 * All functions associated with the custom markdown
 *
 */

/*
 * Parse bullets into objects
 * TODO: look for tabs also
 * 
 * @param {Array.<string>} str_bullets
 * @return {Array.<Object.} bullets
 */ 
const parseBullets = (str_bullets) => {
    const bullets = [];
    for (let i = 0; i < str_bullets.length; i++) {
        let num_tabs = Math.floor(str_bullets[i].search(/\S/) / 4);
        let content = str_bullets[i].trim();
        let temp_bully = {
            depth: num_tabs,
            content: content
        }
        bullets.push(temp_bully);
    }
    return bullets
}

/*
 * Split up slides
 * Breaks up slides by the pound sign
 * 
 * @param {string} slide_data
 * @return {Array.<string>} slide_arr
 */
const splitSlides = (slide_data) => {
    const slide_arr = slide_data.split("#");
    return slide_arr;
}

/* 
 * Make slides json
 * Takes string and places relevant items into object
 * Bullets will remain a string
 * 
 * @param {Array.<string>} slide_arr
 * @return {Array.<Object>} json_slide_arr;
 */
const jsonifyArray = (slide_arr) => {
    let json_slide_arr = []
    slide_arr = slide_arr.filter(Boolean) // filters first empty array
    for (let i = 0; i < slide_arr.length; i++) {
        // split on newlines
        let temp = slide_arr[i].split('\n');
        temp = temp.filter(Boolean) // filter empty lines
        t_slide = {}
        bullet_arr = []
        // set temp title and subtitles
        for (let j = 0; j < temp.length; j++) {
            if (temp[j] === 'Bullets:') {
                j++;
                while (j < temp.length) {
                    bullet_arr.push(temp[j]);
                    j++;
                }
                t_slide['bullets'] = parseBullets(bullet_arr);
            }
            else if (temp[j] === 'Intro') {
                t_slide['type'] = 'Intro';
            }
            else if (temp[j] === 'Content') {
                t_slide['type'] = 'Content';
            }
            else if (temp[j].slice(0, 6) === 'Title:') {
                // slice from length of "title: " to end of the line
                t_slide['title'] = temp[j].slice(7);
            }
            else if (temp[j].slice(0, 9) === 'Subtitle:') {
                // slice from length of "subtitle: " to end of the line
                t_slide['subtitle'] = temp[j].slice(10);
            }
        }

        json_slide_arr.push(t_slide);
    }
    return json_slide_arr
}

/*
 * Parse slide data and place it into object
 * 
 * @param {string} slide_data
 * @return {Slideshow object} instance of slideshow
 * 
 */ 
exports.parseSlides = (slide_data) => {
    return jsonifyArray((splitSlides(slide_data)));
}