<?php

function getDataFromRequest()
{
  $requestBody = file_get_contents('php://input');
  return json_decode($requestBody, true);
}
