<?php

namespace Bifrost\Core;

use Bifrost\Class\HttpError;

/**
 * Classe de configuração do sistema
 *
 * Esta classe é responsável por gerenciar as configurações do sistema.
 * Ela fornece métodos para obter e definir configurações.
 *
 * @package Bifrost\Core
 * @author Felipe dos S. Cavalca
 */
final class Settings
{
    private static bool $initialized = false;

    public function __construct()
    {
        $this->init();
    }

    public function __get($name)
    {
        switch ($name) {
            case "database":
                return $this->getSettingsDatabase();
            default:
                return $this->getEnv($name);
        }
    }

    protected static function getEnv(string $param, bool $required = false): mixed
    {
        if($required && !getenv($param)) {
            throw new HttpError("e500");
        }

        return getenv($param) ?: null;
    }

    private static function setHeaders(): void
    {
        header("X-Powered-By: PHP/" . phpversion());
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Content-Type: application/json; charset=utf-8");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Expose-Headers: Authorization");
    }

    private static function iniSet(): void
    {
        ini_set("display_errors", static::getEnv("PHP_DISPLAY_ERRORS"));
        ini_set("display_startup_errors", static::getEnv("PHP_DISPLAY_STARTUP_ERRORS"));
    }

    public static function init(): void
    {
        // Valida se já foi inicializado
        if (self::$initialized) {
            return;
        }

        static::iniSet();
        static::setHeaders();

        self::$initialized = true;
    }

    private function getSettingsDatabase()
    {
        return [
            "driver" => static::getEnv("MYSQL_DRIVER", true),
            "host" => static::getEnv("MYSQL_HOST", true),
            "port" => static::getEnv("MYSQL_PORT", true),
            "database" => static::getEnv("MYSQL_DATABASE", true),
            "username" => static::getEnv("MYSQL_USER", true),
            "password" => static::getEnv("MYSQL_PASSWORD", true),
        ];
    }
}
