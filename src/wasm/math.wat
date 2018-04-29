(module
  (func (export "add") (param $lhs i32) (param $rhs i32) (result i32)
    get_local $lhs
    get_local $rhs
    i32.add
  )

  (func (export "msToMinutes") (param $time i32) (result i32)
    get_local $time
    i32.const 60000
    i32.div_u
  )

  (func (export "msToSeconds") (param $time i32) (result i32)
    get_local $time
    i32.const 60000
    i32.rem_s
    i32.const 1000
    i32.div_u
  )

  (func (export "secToSeconds") (param $time i32) (result i32)
    get_local $time
    i32.const 60
    i32.rem_s
  )

  (func (export "secToMinutes") (param $time i32) (result i32)
    get_local $time
    i32.const 3600
    i32.rem_s
    i32.const 60
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

  (func (export "test") (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (block $label$0
   (br_if $label$0
    (i32.lt_s
     (get_local $0)
     (i32.const 1)
    )
   )
   (set_local $1
    (i32.const 0)
   )
   (set_local $2
    (i32.const 0)
   )
   (loop $label$1
    (set_local $2
     (i32.add
      (i32.popcnt
       (get_local $1)
      )
      (get_local $2)
     )
    )
    (br_if $label$1
     (i32.ne
      (get_local $0)
      (tee_local $1
       (i32.add
        (get_local $1)
        (i32.const 1)
       )
      )
     )
    )
   )
   (return
    (get_local $2)
   )
  )
  (i32.const 0)
 )
)