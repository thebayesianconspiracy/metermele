package main

import (

	"github.com/ppsreejith/vahana/config"
	"github.com/ppsreejith/vahana/cmd"
)

func main() {
		config.LoadConfigProvider()
    cmd.Execute()	
}
