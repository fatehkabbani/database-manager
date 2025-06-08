<?php
function decrypt_password($encrypted)
{
  // this shit is weak to keep it change it when ur not lazy (decrypt version here)
  return base64_decode($encrypted);
}
function encrypt_password($password)
{
  // this shit is weak to keep it change it when ur not lazy
  return base64_encode($password);
}
