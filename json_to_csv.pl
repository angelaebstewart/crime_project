#! /usr/bin/env perl

use warnings;
use strict;

my $file;
my $num_args = $#ARGV + 1;
if($num_args eq 1) {
        $file = $ARGV[0];
}
else {
	print(STDERR "Arguments needed: data file.\n");
	exit 1;
}

my %hash = ();

print(STDOUT "geoid,state,st,county,population,violent,property,murder,rape,robbery,assault,burglary,larceny,vehicle,arson,male,female,asian,black,hawaiian,native,white,other,multiple,income\n");
open(INPUT, $file);
while(my $line = <INPUT>) {
    #{"abbreviation": "TX", "violent": 126.63159945451004, "asian": "0.001363725", "female": "0.503019677", "rape": 9.74089226573154, "native": "0.007013442", "state": "Texas", "other": "0.042372881", 
    #"black": "0.045782194", "income": "24203.11377", "white": "0.894408728", "murder": 0.0, "hawaiian": "0", "vehicle": 116.89070718877849, "assault": 116.89070718877849, "burglary": 340.93122930060395, 
    #"population": "10266", "county": "Lamb", "male": "0.496980323", "larceny": 526.0081823495032, "robbery": 0.0, "mixed": "0.00905903", "property": 107.14981492304695, "geoid": "48279"}}
    my @json = split('},', $line);
    foreach my $j (@json) {
        if($j =~ m/.*\"abbreviation\": \"(?<st>\w{2}).*\"violent\": (?<violent>\-?\d+(\.\d+)*).*\"asian\": \"(?<asian>\-?\d+(\.\d+)*).*\"female\": \"(?<female>\-?\d+(\.\d+)*).*\"rape\": (?<rape>\-?\d+(\.\d+)*).*\"native\": \"(?<native>\-?\d+(\.\d+)*).*\"state\": \"(?<state>\w+).*\"other\": \"(?<other>\-?\d+(\.\d+)*).*\"black\": \"(?<black>\-?\d+(\.\d+)*).*\"income\": \"(?<income>\-?\d+(\.\d+)*).*\"white\": \"(?<white>\-?\d+(\.\d+)*).*\"murder\": (?<murder>\-?\d+(\.\d+)*)\"hawaiian\": \"(?<hawaiian>\-?\d+(\.\d+)*).*\"vehicle\": (?<vehicle>\-?\d+(\.\d+)*).*\"assault\": (?<assault>\-?\d+(\.\d+)*).*\"burglary\": (?<burglary>\-?\d+(\.\d+)*).*\"population\": \"(?<population>\d+).*\"county\": \"(?<county>\w+).*\"male\": \"(?<male>\-?\d+(\.\d+)*).*\"larceny\": (?<larceny>\-?\d+(\.\d+)*).*\"robbery\": (?<robbery>\-?\d+(\.\d+)*).*\"mixed\": \"(?<multiple>\-?\d+(\.\d+)*).*\"property\": (?<property>\-?\d+(\.\d+)*).*\"geoid\": \"(?<geoid>\d+).*/) {
            print(STDOUT $j);
        }
    }
}
print(STDOUT "\n");
#my $i = 0;
#foreach my $task (sort keys %hash) {
#    if($count_hash{$task} > 1) {
#        if($i < scalar(keys %hash) - 1) {
#            print(STDOUT "{\"task_id\": $task, \"time\": $hash{$task}},");
#        }
#        else {
#            print(STDOUT "$hash{$task}");
#        }
#        $i++;
#    }
#}
#print(STDOUT "\n]}");

# vim: tabstop=8 shiftwidth=4 softtabstop=4 expandtab shiftround autoindent
