package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

// Provider defines a set of read-only methods for accessing the application
// configuration params as defined in one of the config files.
type Provider interface {
	ConfigFileUsed() string
	Get(key string) interface{}
	GetBool(key string) bool
	GetDuration(key string) time.Duration
	GetFloat64(key string) float64
	GetInt(key string) int
	GetInt64(key string) int64
	GetSizeInBytes(key string) uint
	GetString(key string) string
	GetStringMap(key string) map[string]interface{}
	GetStringMapString(key string) map[string]string
	GetStringMapStringSlice(key string) map[string][]string
	GetStringSlice(key string) []string
	GetTime(key string) time.Time
	InConfig(key string) bool
	IsSet(key string) bool
}

var defaultConfig *viper.Viper

func Config() Provider {
	return defaultConfig
}

func GetDBConnURL() string{
	return fmt.Sprintf("postgres://%s:%s/%s?user=%s&password=%s&sslmode=disable",
		defaultConfig.GetString("pg_host"),
		defaultConfig.GetString("pg_port"),
		defaultConfig.GetString("pg_db"),
		defaultConfig.GetString("pg_user"),
		defaultConfig.GetString("pg_pass"),
	)
}

func LoadConfigProvider() {
	defaultConfig = readViperConfig()
}

func readViperConfig() *viper.Viper {
	v := viper.New()
	v.SetConfigFile("./config.yaml")
	v.ReadInConfig()

	// global defaults
	v.SetDefault("json_logs", false)
	v.SetDefault("loglevel", "debug")

	return v
}
