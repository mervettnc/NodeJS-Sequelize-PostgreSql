const Course =require('../models').Course;
const Student =require('../models').Student;
const Lecturer =require('../models').Lecturer;
const Book =require('../models').Book;




module.exports={
    list(req,res){
        return Course
        .findAll({
            include:[{
                model:Student,
                as:'students'
            },{
                model:Lecturer,
                as:'lecturer'
            },{
              model:Book,
              as:'books'
            }
           
           ],
            order:[
                ['createdAt','DESC'],
                
            ],
        })
        .then((courses) => res.status(200).send(courses))
        .catch((error) => { res.status(400).send(error); });
    },
    getById(req, res) {
        return Course
          .findByPk(req.params.id, {
            include: [{
              model: Course,
              as: 'course'
             
            }],
          })
          .then((course) => {
            if (!course) {
              return res.status(404).send({
                message: 'Course Not Found',
              });
            }
            return res.status(200).send(course);
          })
          .catch((error) => res.status(400).send(error));
      },
    
      add(req, res) {
        return Course
          .create({
            course_name: req.body.course_name,
          })
          .then((course) => res.status(201).send(course))
          .catch((error) => res.status(400).send(error));
      },

      addWithBooks(req, res) {
            return Course
              .create({
                course_name: req.body.course_name,
                book: req.body.book
              }, {
                include: [{
                  model: Book,
                  as: 'books'
                }]
              })
              .then((course) => res.status(201).send(course))
              .catch((error) => res.status(400).send(error));
          },
        
    
      update(req, res) {
        return Course
          .findByPk(req.params.id, {
            include: [{
              // model: Course,
              // as: 'course'
              model: Lecturer,
              as: 'lecturer'
            }],
          })
          .then(course => {
            if (!course) {
              return res.status(404).send({
                message: 'Course Not Found',
              });
            }
            return course
              .update({
                course_name: req.body.course_name || course.course_name,
              })
              .then(() => res.status(200).send(course))
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      },
    
      delete(req, res) {
        return Course
          .findByPk(req.params.id)
          .then(course => {
            if (!course) {
              return res.status(400).send({
                message: 'Course Not Found',
              });
            }
            return course
              .destroy()
              .then(() => res.status(204).send())
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      },
};
