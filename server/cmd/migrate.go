package cmd

import (
	"github.com/spf13/cobra"
	"log"

	"github.com/ppsreejith/vahana/config"
	"github.com/golang-migrate/migrate"
	_ "github.com/golang-migrate/migrate/database/postgres"
	_ "github.com/golang-migrate/migrate/source/file"
)

const migrationsURL = "file://./migrations/"

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Migrate the server DB",
	Long:  `Runs the migrations to bring the DB up to date`,
	Run: func(cmd *cobra.Command, args []string) {
		migrator, err := migrate.New(migrationsURL, config.GetDBConnURL())
		if err != nil {
			log.Println("Failed to load migrations", err)
			return
		}
		if len(args) > 0 && args[0] == "down" {
			err = migrator.Down()
		} else {
			    err = migrator.Up()
		}
		if err != nil {
			log.Println("Failed to run migrations", err)
			return
		}
	},
}

func init() {
	rootCmd.AddCommand(migrateCmd)
}
