const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const stories = [
    {
        id: '1',
        title: 'A funny story',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et libero rutrum nisi ultricies placerat vitae vitae felis.',
        author: 'Jason',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '2',
        title: 'It is raining',
        content: 'Vestibulum iaculis scelerisque mollis. Phasellus sit amet efficitur dui. Praesent in ornare sapien.',
        author: 'George',
        createdAt: DateTime.local(2021, 2, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    // ADDED: Exercise story
    {
        id: '3',
        title: 'Learning NBAD',
        content: 'Exercise 4: MVC Application - Phasellus efficitur dui vestibulum iaculis mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ornare sapien cursus mollis.',
        author: 'Jason',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }

]

// console.log(stories[2]);

// return all stories
exports.find = () => stories;

exports.findById = id => stories.find(story=>story.id === id);

exports.save = function (story){
    story.id = uuidv4();
    story.createdAt = Date.now().toLocaleString(DateTime.DATETIME_SHORT)
    stories.push(story);
}

exports.updateById = function (id, newStory){
    let story = stories.find(story=>story.id === id);
    if (story){
        story.title = newStory.title;
        story.content = newStory.content;
        return true;
    } else {
        return false;
    }
}

exports.deleteById = function(id){
    let index = stories.findIndex(story=>story.id === id)
    if (index !== -1){
        stories.splice(index, 1)
        return true;
    } else {
        return false;
    }
}