<?php

$file = file_get_contents('network.har');
$decode = json_decode($file);
$entries = $decode->log->entries;

$output = fopen('output.csv', 'w');
fputcsv($output, ['File', 'Time', 'Size']);

foreach($entries as $entry) {
  $scrubbed = [
    'file' => $entry->request->url,
    'time' => $entry->time,
    'size' => $entry->response->bodySize,
  ];

  fputcsv($output, $scrubbed);
}

fclose($output);
