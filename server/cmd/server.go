package cmd

import (
	"github.com/spf13/cobra"
	"github.com/ppsreejith/vahana/server"
)

var startServerCmd = &cobra.Command{
	Use:   "server",
	Short: "Starts the server",
	Run: func(cmd *cobra.Command, args []string) {
		server.StartServer()
	},
}

func init() {
	rootCmd.AddCommand(startServerCmd)
}
