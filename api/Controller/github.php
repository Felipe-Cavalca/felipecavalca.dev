<?php

namespace Bifrost\Controller;

use Bifrost\Interface\ControllerInterface;
use Bifrost\Include\Controller;
use Bifrost\Model\Github as GithubModel;
use Bifrost\Attributes\Method;
use Bifrost\Attributes\Cache;

class Github implements ControllerInterface
{
    use controller;

    /**
     * Função consulta os repositorios e retorna as linguagens
     * @return array
     */
    #[Method(["GET"])]
    #[Cache("github-getLanguages", 60)]
    public function getLanguages()
    {
        $github = new GithubModel();

        // Dados das linguagens e seus respectivos bytes
        $languageData = $github->getLanguages();

        // Calcula o total de bytes
        $totalBytes = array_sum($languageData);

        // Calcula a porcentagem para cada linguagem
        $languagePercentages = [];
        foreach ($languageData as $language => $bytes) {
            $percentage = ($bytes / $totalBytes) * 100;
            $languagePercentages[$language] = number_format($percentage, 1); // Formatação para uma casa decimal
        }

        return $languagePercentages;
    }
}
