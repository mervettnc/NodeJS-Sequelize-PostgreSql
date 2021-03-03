const Student = require('../models').Student;
const Classroom = require('../models').Classroom;
const Course = require('../models').Course;
const StudentCourse = require('../models').StudentCourse;


module.exports = {
  list(req, res) {
    return Student
      .findAll({
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
        order: [
          ['createdAt', 'DESC'],
          [{ model: Course, as: 'courses' }, 'createdAt', 'DESC'],
        ],
      })
      .then((students) => res.status(200).send(students))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return Student
      .findByPk(req.params.id, {
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
      })
      .then((student) => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        return res.status(200).send(student);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return Student
      .create({
        classroom_id: req.body.classroom_id,
        student_name: req.body.student_name,
      })
      .then((student) => res.status(201).send(student))
      .catch((error) => res.status(400).send(error));
  },

  addCourse(req, res) {
    return Student
      .findByPk(req.body.student_id, {
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
      })
      .then((student) => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        Course.findByPk(req.body.course_id).then((course) => {
          if (!course) {
            return res.status(404).send({
              message: 'Course Not Found',
            });
          }
          student.addCourse(course);
          return res.status(200).send(student);
        })
      })
      .catch((error) => res.status(400).send(error));
  },

  addCoursePoint(req, res) {
    return Student
      .findByPk(req.body.student_id, {
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
      })
      .then((student) => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        Course.findByPk(req.body.course_id).then((course) => {
          if (!course) {
            return res.status(404).send({
              message: 'Course Not Found',
            });
          }

          StudentCourse.findAll({
            where: {
              student_id: student.id,
              course_id: course.id
            }
          }).then((studentCourseList) => {
            if(studentCourseList.length > 0){
              let studentCourse= studentCourseList[0];
              studentCourse.point = req.body.point;
              studentCourse.save();
              return res.status(200).send(studentCourse);
            }else
            return res.status(404).send({
              message: 'StudentCourse Not Found',
            });

          })

        
          
          console.log("")

          // StudentCourse.create({
          //   student_id: student.id,
          //   course_id: course.id,
          //   point:req.body.point
          // })
          //student.addCourse(course);
        })
      })
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Student
      .findByPk(req.params.id, {
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
      })
      .then(student => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        return student
          .update({
            student_name: req.body.student_name || student.student_name,
          })
          .then(() => res.status(200).send(student))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Student
      .findByPk(req.params.id)
      .then(student => {
        if (!student) {
          return res.status(400).send({
            message: 'Student Not Found',
          });
        }
        return student
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  // deleteAll(req, res){
  //   return Student.destroy({
  //     where: {}
  //   }).then(() => res.status(204).send())
  // }
};