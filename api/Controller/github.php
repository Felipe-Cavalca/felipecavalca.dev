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
        return $github->getLanguages();
    }
}
