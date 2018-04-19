(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add)
  (func (export "minutes") (param $lhs i32) (result i32)
    get_local $lhs
    i32.const 60000
    i32.div_s
  )
  (func (export "seconds") (param $lhs i32) (result i32)
    get_local $lhs
    i32.const 60000
    i32.rem_s
    i32.const 1000
    i32.div_s
  )
  (export "add" (func $add))
)