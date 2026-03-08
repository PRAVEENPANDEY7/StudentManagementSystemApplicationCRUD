package org.studentmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.studentmanagementsystem.model.Student;

public interface StudentRepository extends JpaRepository<Student, Integer>{

}
