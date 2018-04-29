(module
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

  (func (export "benchmarkSecToSeconds") (result i32)
    (local $count i32)
    (local $sum i32)
    (local $i i32)
    (set_local $sum (i32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (i32.rem_s (i32.const 60) (i32.const 900))
        )
        (br_if $mainloop
          ( i32.gt_s
            ( get_local $count )
            ( tee_local $i (i32.add (get_local $i) (i32.const 1) ) )
          )
        )
      )
      (return (get_local $sum))
    )
    (i32.const 0)
  )
)