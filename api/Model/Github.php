<?php

namespace Bifrost\Model;

use Bifrost\Core\Settings;
use Bifrost\Class\HttpError;
class Github
{
    public string $userName = "Felipe-Cavalca";
    public array $repositories = [
        "felipecavalca.dev",
        "base-repo",
        "BifrostPHP",
        "BifrostPHP-Components",
        "BifrostPHP-Front",
        "BifrostPHP-Back",
        "BifrostPHP-Database",
    ];

    /**
     * Função que consulta os repositorios e retorna as linguagens
     * @return array
     */
    public function getLanguages(): array
    {
        $settings = new Settings();

        $data = [];
        foreach ($this->repositories as $repository) {
            $url = "https://api.github.com/repos/$this->userName/$repository/languages";
            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: token ' . $settings->GITHUB_TOKEN,
                'User-Agent: request'
            ]);

            $response = curl_exec($ch);
            $response = json_decode($response, true);
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($httpcode != 200) {
                throw new HttpError("e500");
                return null;
            }

            foreach ($response as $language => $value) {
                if (isset($data[$language])) {
                    $data[$language] += $value;
                } else {
                    $data[$language] = $value;
                }
            }
        }
        return $data;
    }
}
