const path = require('path');
const fs = require('fs');

class Card {
    constructor(){

    }
    static async add(course) {
        const card = await Card.fetch();
        const index = card.courses.findIndex(c => c.id === course.id);
        const candidate = card.courses[index];

        if(candidate) {
            candidate.count++;
            card.courses[index] = candidate;
        } else {
            course.count = 1;
            card.courses.push(course);
        }
        card.price += +course.price;
        return new Promise(((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, "..", "data", "card.json"),
                JSON.stringify(card),
                (err) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            )
        }))
    }
    static async remove(id) {
        const card = await Card.fetch();
        const index = card.courses.findIndex(c => c.id === id);
        const course = card.courses[index];
        if(course.count === 1) {
            card.courses.filter(c => c.id !== id);
        } else {
            card.courses[index].count --;
        }
        card.price -= course.price;
        return new Promise(((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, "..", "data", "card.json"),
                JSON.stringify(card),
                (err) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(card);
                    }
                }
            )
        }))
    }

    static async fetch() {
    return new Promise((resolve, reject) => {
        fs.readFile(
            path.join(__dirname, "..", "data", "card.json"),
            'utf-8',
        (err, content) => {
               if(err) {
                   reject(err);
               } else {
                   resolve(JSON.parse(content));
               }
        }
        )
    })
    }
}


module.exports = Card;