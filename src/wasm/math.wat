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
          (i32.rem_s (i32.const 900) (i32.const 60))
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

  (func (export "benchmarkSecToMinutes") (result i32)
    (local $count i32)
    (local $sum i32)
    (local $i i32)
    (set_local $sum (i32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (i32.div_u (i32.rem_s (i32.const 3600) (i32.const 900)) (i32.const 60))
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

  (func (export "benchmarkMsToMinutes") (result i32)
    (local $count i32)
    (local $sum i32)
    (local $i i32)
    (set_local $sum (i32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (i32.div_u (i32.const 900000) (i32.const 60000))
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

  (func (export "benchmarkMsToSeconds") (result i32)
    (local $count i32)
    (local $sum i32)
    (local $i i32)
    (set_local $sum (i32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (i32.div_u (i32.rem_s (i32.const 900000) (i32.const 60000)) (i32.const 1000))
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

  (func (export "benchmarkPercent") (result f32)
    (local $count i32)
    (local $sum f32)
    (local $i i32)
    (set_local $sum (f32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (f32.ceil (f32.mul (f32.const 100) (f32.div (f32.const 28) (f32.const 24))))
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
    (f32.const 0)
  )

  (func (export "benchmarkSeekTime") (result f32)
    (local $count i32)
    (local $sum f32)
    (local $i i32)
    (set_local $sum (f32.const 1))
    (set_local $count (i32.const 1000000))
    (block $stop
      (br_if $stop (i32.lt_s (get_local $count) (i32.const 1)))
      (loop $mainloop 
        (set_local $sum 
          (f32.mul (f32.const 2000454) (f32.div (f32.const 80) (f32.const 100)))
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
    (f32.const 0)
  )
)