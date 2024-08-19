<?php

/**
 * It is responsible for managing the cache.
 *
 * @category Core
 * @package Bifrost\Core
 */

namespace Bifrost\Core;

use Redis;

/**
 * It is responsible for managing the cache.
 *
 * @package Bifrost\Core
 */
class Cache
{
    /** It is responsible for controlling the initialization of the cache. */
    private static $redis;

    /**
     * It is responsible for initializing the cache.
     *
     * @return void
     */
    public function __construct()
    {
        if (empty(self::$redis)) {
            self::conn();
        }
    }

    /**
     * It is responsible for connecting to the cache.
     *
     * @return void
     */
    private static function conn(): void
    {
        self::$redis = new Redis();
        self::$redis->connect('redis', 6379);
    }

    /**
     * It is responsible for setting the cache.
     *
     * @param string $key The key to be set.
     * @param mixed $value The value to be set.
     * @param int $expire The expiration time of the cache.
     * @return bool
     *
     * @example
     * <pre>
     * // Example 1: Setting a simple value
     * $key = 'user_1';
     * $value = ['name' => 'John Doe', 'email' => 'john.doe@example.com'];
     * $expire = 3600; // 1 hour
     * $success = $this->set($key, $value, $expire);
     * // Result: true if the cache was set successfully, false otherwise
     * </pre>
     *
     * @example
     * <pre>
     * // Example 2: Setting a value using a function
     * $key = 'user_2';
     * $value = function() {
     *     return ['name' => 'Jane Doe', 'email' => 'jane.doe@example.com'];
     * };
     * $expire = 3600; // 1 hour
     * $success = $this->set($key, $value, $expire);
     * // Result: true if the cache was set successfully, false otherwise
     * </pre>
     */
    public function set(string $key, mixed $value, int $expire = 0): bool
    {
        if (is_callable($value)) {
            $value = $value();
        }

        return self::$redis->set($key, serialize($value), $expire);
    }

    /**
     * It is responsible for getting the cache.
     *
     * @param string $key The key to be retrieved.
     * @param mixed $value The value to be set if the cache does not exist.
     * @param int $expire The expiration time of the cache.
     * @uses Cache::set()
     * @return mixed
     *
     * @example
     * <pre>
     * // Example 1: Getting a simple value
     * $key = 'user_1';
     * $defaultValue = ['name' => 'John Doe', 'email' => 'john.doe@test.com'];
     * $expire = 3600; // 1 hour
     * $user = $this->get($key, $defaultValue, $expire);
     * // Result: Returns the cached value if it exists, otherwise sets and returns the default value
     * </pre>
     *
     * @example
     * <pre>
     * // Example 2: Getting a value using a function
     * $key = 'user_2';
     * $defaultValue = function() {
     *     return ['name' => 'Jane Doe', 'email' => 'jane.doe@test.com'];
     * };
     * $expire = 3600; // 1 hour
     * $user = $this->get($key, $defaultValue, $expire);
     * // Result: Returns the cached value if it exists, otherwise sets and returns the value from the function
     * </pre>
     */
    public function get(string $key, mixed $value = null, int $expire = 0): mixed
    {
        if (!$this->exists($key) && !empty($value)) {
            $this->set($key, $value, $expire);
        }
        return unserialize(self::$redis->get($key));
    }

    /**
     * It is responsible for checking if the cache exists.
     *
     * @param string $key The key to be checked.
     * @return bool
     */
    public function exists(string $key): bool
    {
        return self::$redis->exists($key);
    }

    /**
     * It is responsible for deleting the cache.
     *
     * @param string $key The key to be deleted.
     * @return bool
     */
    public function del(string $key): bool
    {
        return self::$redis->del($key);
    }
}
