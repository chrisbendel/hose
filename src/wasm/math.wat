(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add)
  (func (export "minutes") (param $lhs i32) (result i32)
    get_local $lhs
    i32.const 60000
    i32.div_u
  )
  (func (export "seconds") (param $lhs i32) (result i32)
    get_local $lhs
    i32.const 60000
    i32.rem_s
    i32.const 1000
    i32.div_u
  )
  (export "add" (func $add))

  (func (export "percent") (param $likes f32) (param $max f32) (result f32)
    get_local $likes
    get_local $max
    f32.div
    f32.const 100
    f32.mul
    f32.ceil
  )
)