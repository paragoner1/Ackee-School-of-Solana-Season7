#[cfg(test)]
mod calculator_tests {
    use crate::calculator::*;
    use rand::Rng;

    #[test]
    fn addition() {
        let x_in: i64 = 1;
        let y_in: i64 = 5;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.addition(x_in, y_in), x_in.checked_add(y_in));

        let new_x_in: i64 = 8;
        let new_y_in: i64 = 57;

        assert_eq!(calculator.addition(new_x_in, new_y_in), new_x_in.checked_add(new_y_in));
    }

    #[test]
    fn subtraction() {
        let x_in: i64 = 1;
        let y_in: i64 = 5;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.subtraction(x_in, y_in), x_in.checked_sub(y_in));

        let new_x_in: i64 = 13;
        let new_y_in: i64 = 21;

        assert_eq!(calculator.subtraction(new_x_in, new_y_in), new_x_in.checked_sub(new_y_in));
    }

    #[test]
    fn multiplication() {
        let x_in: i64 = 1;
        let y_in: i64 = 5;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.multiplication(x_in, y_in), x_in.checked_mul(y_in));

        let new_x_in: i64 = 2;
        let new_y_in: i64 = 473;

        assert_eq!(calculator.multiplication(new_x_in, new_y_in), new_x_in.checked_mul(new_y_in));
    }

    #[test]
    fn overflow_add() {
        let x_in: i64 = i64::MAX;
        let y_in: i64 = 1;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.addition(x_in, y_in), None);
    }

    #[test]
    fn overflow_sub() {
        let x_in: i64 = i64::MIN;
        let y_in: i64 = 1;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.subtraction(x_in, y_in), None);
    }

    #[test]
    fn overflow_mul() {
        let x_in: i64 = i64::MAX / 2 + 1;
        let y_in: i64 = 2;
        let mut calculator = Calculator::new();

        assert_eq!(calculator.multiplication(x_in, y_in), None);
    }

    #[test]
    fn random_inputs_calculator() {
        let mut rng = rand::thread_rng();
        for _ in 0..50_000 {
            let x_in = rng.gen::<i64>();
            let y_in = rng.gen::<i64>();

            let mut calculator = Calculator::new();
            assert_eq!(calculator.addition(x_in, y_in), x_in.checked_add(y_in));
            assert_eq!(calculator.subtraction(x_in, y_in), x_in.checked_sub(y_in));
            assert_eq!(calculator.multiplication(x_in, y_in), x_in.checked_mul(y_in));
        }
    }

    #[test]
    fn operation_type_get_sign() {
        assert_eq!(OperationType::Addition.get_sign(), "+");
        assert_eq!(OperationType::Subtraction.get_sign(), "-");
        assert_eq!(OperationType::Multiplication.get_sign(), "*");
    }

    #[test]
    fn operation_type_perform() {
        // Test normal operations
        assert_eq!(OperationType::Addition.perform(5, 3), Some(8));
        assert_eq!(OperationType::Subtraction.perform(5, 3), Some(2));
        assert_eq!(OperationType::Multiplication.perform(5, 3), Some(15));

        // Test with negative numbers
        assert_eq!(OperationType::Addition.perform(-5, 3), Some(-2));
        assert_eq!(OperationType::Subtraction.perform(-5, 3), Some(-8));
        assert_eq!(OperationType::Multiplication.perform(-5, 3), Some(-15));

        // Test with zero
        assert_eq!(OperationType::Addition.perform(0, 5), Some(5));
        assert_eq!(OperationType::Subtraction.perform(0, 5), Some(-5));
        assert_eq!(OperationType::Multiplication.perform(0, 5), Some(0));

        // Test overflow cases
        assert_eq!(OperationType::Addition.perform(i64::MAX, 1), None);
        assert_eq!(OperationType::Subtraction.perform(i64::MIN, 1), None);
        assert_eq!(OperationType::Multiplication.perform(i64::MAX / 2 + 1, 2), None);
    }

    #[test]
    fn operation_creation() {
        let op = Operation::new(10, 5, OperationType::Addition);
        assert_eq!(op.first_num, 10);
        assert_eq!(op.second_num, 5);
        assert_eq!(op.operation_type.get_sign(), "+");
    }

    #[test]
    fn show_history_empty() {
        let calculator = Calculator::new();
        assert_eq!(calculator.show_history(), "");
    }

    #[test]
    fn show_history_single_operation() {
        let mut calculator = Calculator::new();
        calculator.addition(5, 3);
        
        let history = calculator.show_history();
        assert_eq!(history, "0: 5 + 3 = 8\n");
    }

    #[test]
    fn show_history_multiple_operations() {
        let mut calculator = Calculator::new();
        calculator.addition(10, 5);
        calculator.subtraction(20, 8);
        calculator.multiplication(3, 4);
        
        let history = calculator.show_history();
        let expected = "0: 10 + 5 = 15\n1: 20 - 8 = 12\n2: 3 * 4 = 12\n";
        assert_eq!(history, expected);
    }

    #[test]
    fn repeat_valid_operation() {
        let mut calculator = Calculator::new();
        calculator.addition(7, 3);
        calculator.subtraction(15, 5);
        
        // Repeat the first operation (addition)
        let result = calculator.repeat(0);
        assert_eq!(result, Some(10));
        
        // Check that it was added to history
        let history = calculator.show_history();
        let expected = "0: 7 + 3 = 10\n1: 15 - 5 = 10\n2: 7 + 3 = 10\n";
        assert_eq!(history, expected);
    }

    #[test]
    fn repeat_invalid_index() {
        let mut calculator = Calculator::new();
        calculator.addition(5, 2);
        
        // Try to repeat operation at index 5 (doesn't exist)
        let result = calculator.repeat(5);
        assert_eq!(result, None);
        
        // History should remain unchanged
        let history = calculator.show_history();
        assert_eq!(history, "0: 5 + 2 = 7\n");
    }

    #[test]
    fn repeat_from_empty_history() {
        let mut calculator = Calculator::new();
        
        // Try to repeat when no operations exist
        let result = calculator.repeat(0);
        assert_eq!(result, None);
        
        // History should still be empty
        assert_eq!(calculator.show_history(), "");
    }

    #[test]
    fn clear_history_empty() {
        let mut calculator = Calculator::new();
        calculator.clear_history();
        assert_eq!(calculator.show_history(), "");
    }

    #[test]
    fn clear_history_with_operations() {
        let mut calculator = Calculator::new();
        calculator.addition(1, 2);
        calculator.subtraction(10, 5);
        calculator.multiplication(3, 3);
        
        // Verify history exists
        assert!(!calculator.show_history().is_empty());
        
        // Clear history
        calculator.clear_history();
        assert_eq!(calculator.show_history(), "");
        
        // Verify repeat doesn't work after clearing
        assert_eq!(calculator.repeat(0), None);
    }

    #[test]
    fn calculator_workflow_integration() {
        let mut calculator = Calculator::new();
        
        // Perform some operations
        calculator.addition(10, 5);
        calculator.multiplication(3, 4);
        
        // Repeat first operation
        calculator.repeat(0);
        
        // Check complete history
        let history = calculator.show_history();
        let expected = "0: 10 + 5 = 15\n1: 3 * 4 = 12\n2: 10 + 5 = 15\n";
        assert_eq!(history, expected);
        
        // Clear and verify
        calculator.clear_history();
        assert_eq!(calculator.show_history(), "");
        
        // Add new operation after clearing
        calculator.subtraction(20, 7);
        assert_eq!(calculator.show_history(), "0: 20 - 7 = 13\n");
    }
}

#[cfg(test)]
mod shapes_tests {
    use crate::shapes::*;
    use float_cmp::{assert_approx_eq, F64Margin};
    use rand::Rng;

    // default margin
    const MARGIN: F64Margin = F64Margin {
        epsilon: f64::EPSILON,
        ulps: 4,
    };

    macro_rules! perimeter {
        // if one argument it is circumference for circle
        ($radius:ident) => {
            2.0 * $radius * std::f64::consts::PI
        };
        // if two arguments it is perimeter for rectangle
        ($a:ident,$b:ident) => {
            2.0 * $a + 2.0 * $b
        };
    }

    macro_rules! area {
        // if one argument it is area for circle
        ($radius:ident) => {
            $radius * $radius * std::f64::consts::PI
        };
        // if two arguments it is area for rectangle
        ($a:ident,$b:ident) => {
            $a * $b
        };
    }

    #[test]
    fn rectangle_area() {
        let width_in: f64 = 15.0;
        let height_in: f64 = 7.0;
        let rectangle = Rectangle::new(width_in, height_in).unwrap();

        let computed_area = rectangle.area();
        let reference_area = area!(width_in, height_in);

        assert_eq!(computed_area, reference_area);
    }

    #[test]
    fn rectangle_wrong_input() {
        let width_in: f64 = 5.0;
        let height_in: f64 = 7.0;
        let mut rectangle = Rectangle::new(width_in, height_in).unwrap();

        let new_width_in: f64 = -5.0;
        let res = rectangle.set_width(new_width_in);

        assert!(res.is_err());
    }

    #[test]
    fn rectangle_area_with_set() {
        let width_in: f64 = 51.0;
        let height_in: f64 = 23.0;
        let mut rectangle = Rectangle::new(width_in, height_in).unwrap();

        let computed_area = rectangle.area();
        let reference_area = area!(width_in, height_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);

        let new_width_in: f64 = 8.0;
        let res = rectangle.set_width(new_width_in);
        assert!(res.is_ok());

        let computed_area = rectangle.area();
        let reference_area = area!(new_width_in, height_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);

        let new_height_in: f64 = 5.0;
        let res = rectangle.set_height(new_height_in);
        assert!(res.is_ok());

        let computed_area = rectangle.area();
        let reference_area = area!(new_width_in, new_height_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);
    }

    #[test]
    fn circle_area() {
        let r_in: f64 = 4.0;
        let circle = Circle::new(r_in).unwrap();

        let computed_area = circle.area(); // an error here will disappear once you implement the area method for Circle
        let reference_area = area!(r_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);
    }

    #[test]
    fn circle_wrong_input() {
        let r_in: f64 = 5.0;
        let mut circle = Circle::new(r_in).unwrap();

        let new_r_in: f64 = -5.0;
        let res = circle.set_radius(new_r_in);

        assert!(res.is_err());
    }

    #[test]
    fn circle_area_with_set() {
        let r_in: f64 = 17.0;
        let mut circle = Circle::new(r_in).unwrap();

        let computed_area = circle.area(); // an error here will disappear once you implement the Shape trait for Circle
        let reference_area = area!(r_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);

        let new_r_in: f64 = 8.0;
        let res = circle.set_radius(new_r_in); // an error here will disappear once you implement the set_radius method for Circle

        assert!(res.is_ok());

        let computed_area = circle.area(); // an error here will disappear once you implement the Shape trait for Circle
        let reference_area = area!(new_r_in);

        assert_approx_eq!(f64, computed_area, reference_area, MARGIN);
    }

    #[test]
    fn rectangle_circumference() {
        let width_in: f64 = 15.0;
        let height_in: f64 = 7.0;
        let rectangle = Rectangle::new(width_in, height_in).unwrap();

        let computed_circ = rectangle.perimeter();
        let reference_circ = perimeter!(width_in, height_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
    }

    #[test]
    fn rectangle_perimeter_with_set() {
        let width_in: f64 = 584.0;
        let height_in: f64 = 1287.0;
        let mut rectangle = Rectangle::new(width_in, height_in).unwrap();

        let computed_circ = rectangle.perimeter();
        let reference_circ = perimeter!(width_in, height_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);

        let new_width_in: f64 = 8.0;
        let res = rectangle.set_width(new_width_in);
        assert!(res.is_ok());

        let computed_circ = rectangle.perimeter();
        let reference_circ = perimeter!(new_width_in, height_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);

        let new_height_in: f64 = 8.0;
        let res = rectangle.set_height(new_height_in);
        assert!(res.is_ok());

        let computed_circ = rectangle.perimeter();
        let reference_circ = perimeter!(new_width_in, new_height_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
    }

    #[test]
    fn circle_perimeter() {
        let r_in: f64 = 7.0;
        let circle = Circle::new(r_in).unwrap();

        let computed_circ = circle.perimeter(); // an error here will disappear once you implement the Shape trait for Circle
        let reference_circ = perimeter!(r_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
    }

    #[test]
    fn circle_perimeter_with_set() {
        let r_in: f64 = 3.0;
        let mut circle = Circle::new(r_in).unwrap();

        let computed_circ = circle.perimeter(); // an error here will disappear once you implement the Shape trait for Circle
        let reference_circ = perimeter!(r_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);

        let new_r_in: f64 = 8.0;
        let res = circle.set_radius(new_r_in); // an error here will disappear once you implement the set_radius method for Circle
        assert!(res.is_ok());

        let computed_circ = circle.perimeter(); // an error here will disappear once you implement the Shape trait for Circle
        let reference_circ = perimeter!(new_r_in);

        assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
    }

    #[test]
    fn random_inputs_shapes() {
        let mut rng = rand::thread_rng();
        for _ in 0..50_000 {
            let a_sign = if rng.gen::<bool>() { 1.0 } else { -1.0 };
            let a_magnitude: f64 = rng.gen::<f64>();
            let width_in = a_sign * a_magnitude * f32::MAX as f64;

            let b_sign = if rng.gen::<bool>() { 1.0 } else { -1.0 };
            let b_magnitude: f64 = rng.gen::<f64>();
            let height_in = b_sign * b_magnitude * f32::MAX as f64;

            let r_sign = if rng.gen::<bool>() { 1.0 } else { -1.0 };
            let r_magnitude: f64 = rng.gen::<f64>();
            let r_in = r_sign * r_magnitude * f32::MAX as f64;

            let circle = Circle::new(r_in);
            let rectangle = Rectangle::new(width_in, height_in);

            if r_in < 0.0 {
                assert!(circle.is_err());
            } else {
                let circle = circle.unwrap();

                let computed_circ = circle.perimeter(); // an error here will disappear once you implement the Shape trait for Circle
                let computed_area = circle.area(); // an error here will disappear once you implement the Shape trait for Circle

                let reference_circ = perimeter!(r_in);
                let reference_area = area!(r_in);

                assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
                assert_approx_eq!(f64, computed_area, reference_area, MARGIN);
            }

            if width_in < 0.0 || height_in < 0.0 {
                assert!(rectangle.is_err());
            } else {
                let rectangle = rectangle.unwrap();
                let computed_circ = rectangle.perimeter();
                let computed_area = rectangle.area();

                let reference_circ = perimeter!(width_in, height_in);
                let reference_area = area!(width_in, height_in);

                assert_approx_eq!(f64, computed_circ, reference_circ, MARGIN);
                assert_approx_eq!(f64, computed_area, reference_area, MARGIN);
            }
        }
    }
}
