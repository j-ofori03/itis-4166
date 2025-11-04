const model = require('../models/story');

exports.index = (req, res)=>{
    // res.send('send all stories')
    let stories = model.find();
    res.render('./story/index', {stories});
};

exports.new = (req, res) => {
    // res.send('send the new form');
    res.render('./story/new');
};

exports.create = (req, res) => {
    // res.send('Created a new story')
    // console.log(req.body);
    let story = req.body;
    model.save(story);
    res.redirect('/stories');
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let story = model.findById(id);
    if (story){
        res.render('./story/show', {story})
    }
    else {
        let error = new Error('Cannot find a story with id ' + id);
        error.status = 404;
        next(err);
    }
}

exports.edit = (req, res, next) => {
    // res.send('send the edit form');
    let id = req.params.id;
    let story = model.findById(id);
    if (story){
        res.render('./story/edit', {story})
    } else {
        let error = new Error('Cannot find a story with id ' + id);
        error.status = 404;
        next(err);
    } 
}

exports.update = (req, res, next) => {
    let story = req.body;
    let id = req.params.id;
    if (model.updateById(id, story)){
        res.redirect('/stories/' + id)
    } else {
        let error = new Error('Cannot find a story with id ' + id);
        error.status = 404;
        next(err);
    }
}

exports.delete = (req, res, next) => {
    // res.send('delete story with id');
    let id = req.params.id;
    if (model.deleteById(id)){
        res.redirect('/stories')
    }
    else {
        let error = new Error('Cannot find a story with id ' + id);
        error.status = 404;
        next(err);
    }
}