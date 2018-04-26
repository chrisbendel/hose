(module
  (func (export "add") (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add
  )

  (func (export "minutes") (param $time i32) (result i32)
    get_local $time
    i32.const 60000
    i32.div_u
  )

  (func (export "seconds") (param $time i32) (result i32)
    get_local $time
    i32.const 60000
    i32.rem_s
    i32.const 1000
    i32.div_u
  )

  (func (export "hours") (param $time i32) (result i32)
    get_local $time
    i32.const 3600
    i32.div_u
  )

  (func (export "percent") (param $likes f32) (param $max f32) (result f32)
    get_local $likes
    get_local $max
    f32.div
    f32.const 100
    f32.mul
    f32.ceil
  )

  (func (export "seekTime")
    (param $offset f32)
    (param $offsetWidth f32)
    (param $duration f32)
    (result f32)

    get_local $offset
    get_local $offsetWidth
    f32.div
    get_local $duration
    f32.mul
  )
)