#![allow(dead_code)]
#![allow(unused_doc_comments)]

///-------------------------------------------------------------------------------
///
/// This file serves as an example to demonstrate what 
/// the correctly implemented functionality should look like.
/// 
/// Do not modify anything in this file!
///
///-------------------------------------------------------------------------------

mod tests;
mod calculator;
mod shapes;
use calculator::*;
use shapes::*;

fn rectangle_example() {
    let width_in: f64 = 7.0;
    let height_in: f64 = 3.0;
    let mut rectangle = Rectangle::new(width_in, height_in).unwrap();
    
    let new_width_in: f64 = 15.0;
    let new_height_in: f64 = 2.0;
    
    let res = rectangle.set_width(new_width_in);
    assert!(res.is_ok());
    
    let res = rectangle.set_height(new_height_in);
    assert!(res.is_ok());
    
    let new_height_in: f64 = -2.0;
    
    let res = rectangle.set_height(new_height_in);
    
    assert_eq!(
        res.err(),
        Some(Error::InvalidHeight)
    );
}

fn circle_example() {
    let radius_in: f64 = 17.0;
    let mut circle = Circle::new(radius_in).unwrap();
    
    let new_radius_in: f64 = 15.0;
    let res = circle.set_radius(new_radius_in);
    assert!(res.is_ok());
    
    let new_radius_in: f64 = -15.0;
    let res = circle.set_radius(new_radius_in);
    
    assert_eq!(
        res.err(),
        Some(Error::InvalidRadius)
    );
}

fn calculator_example() {
    let x_in: i64 = -4;
    let y_in: i64 = 9;

    let mut calculator = Calculator::new();
    let addition = calculator.addition(x_in, y_in);
    let subtraction = calculator.subtraction(x_in, y_in);
    let multiplication = calculator.multiplication(x_in, y_in);
    
    assert_eq!(addition, Some(5));
    assert_eq!(subtraction, Some(-13));
    assert_eq!(multiplication, Some(-36));

    calculator.repeat(1);
    calculator.repeat(0);
    
    let history = calculator.show_history();
    let expected = "0: -4 + 9 = 5\n1: -4 - 9 = -13\n2: -4 * 9 = -36\n3: -4 - 9 = -13\n4: -4 + 9 = 5\n";

    /// Calculator history output:
    /// 
    /// 0: -4 + 9 = 5
    /// 1: -4 - 9 = -13
    /// 2: -4 * 9 = -36
    /// 3: -4 - 9 = -13
    /// 4: -4 + 9 = 5
    assert_eq!(history, expected);

    calculator.clear_history();
    assert_eq!(calculator.show_history(), "");

    assert_eq!(calculator.repeat(1), None);
    assert_eq!(calculator.show_history(), "");
}

fn main() {
    calculator_example();
    rectangle_example();
    circle_example();

    println!("All examples completed successfully!");
} 