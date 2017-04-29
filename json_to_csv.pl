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
my $geoid = 0;
my $state = 0;
my $st = 0;
my $county = 0;
my $population = 0;
my $violent = 0;
my $property = 0;
my $murder = 0;
my $rape = 0;
my $robbery = 0;
my $assault = 0;
my $burglary = 0;
my $larceny = 0;
my $vehicle = 0;
my $arson = 0;
my $male = 0;
my $female = 0;
my $asian = 0;
my $black = 0;
my $hawaiian = 0;
my $native = 0;
my $white = 0;
my $other = 0;
my $multiple = 0;
my $income = 0;

my $i = 0;
my $x = 0;

print(STDOUT "geoid,state,st,county,population,violent,property,murder,rape,robbery,assault,burglary,larceny,vehicle,arson,male,female,asian,black,hawaiian,aboriginal,white,other,multiple,income\n");
open(INPUT, $file);
while(my $line = <INPUT>) {
    #{"abbreviation": "TX", "violent": 126.63159945451004, "asian": "0.001363725", "female": "0.503019677", "rape": 9.74089226573154, "native": "0.007013442", "state": "Texas", "other": "0.042372881", 
    #"black": "0.045782194", "income": "24203.11377", "white": "0.894408728", "murder": 0.0, "hawaiian": "0", "vehicle": 116.89070718877849, "assault": 116.89070718877849, "burglary": 340.93122930060395, 
    #"population": "10266", "county": "Lamb", "male": "0.496980323", "larceny": 526.0081823495032, "robbery": 0.0, "mixed": "0.00905903", "property": 107.14981492304695, "geoid": "48279"}}
    my @json = split('},', $line);
    foreach my $j (@json) {
#        if($j =~ m/.*\"abbreviation\": \"(?<st>\w{2}).*\"violent\": (?<violent>\-?\d+(\.\d+)*).*\"asian\": \"(?<asian>\-?\d+(\.\d+)*).*\"female\": \"(?<female>\-?\d+(\.\d+)*).*\"rape\": (?<rape>\-?\d+(\.\d+)*).*\"native\": \"(?<native>\-?\d+(\.\d+)*).*\"state\": \"(?<state>\w+).*\"other\": \"(?<other>\-?\d+(\.\d+)*).*\"black\": \"(?<black>\-?\d+(\.\d+)*).*\"income\": \"(?<income>\-?\d+(\.\d+)*).*\"white\": \"(?<white>\-?\d+(\.\d+)*).*\"murder\": (?<murder>\-?\d+(\.\d+)*)\"hawaiian\": \"(?<hawaiian>\-?\d+(\.\d+)*).*\"vehicle\": (?<vehicle>\-?\d+(\.\d+)*).*\"assault\": (?<assault>\-?\d+(\.\d+)*).*\"burglary\": (?<burglary>\-?\d+(\.\d+)*).*\"population\": \"(?<population>\d+).*\"county\": \"(?<county>\w+).*\"male\": \"(?<male>\-?\d+(\.\d+)*).*\"larceny\": (?<larceny>\-?\d+(\.\d+)*).*\"robbery\": (?<robbery>\-?\d+(\.\d+)*).*\"mixed\": \"(?<multiple>\-?\d+(\.\d+)*).*\"property\": (?<property>\-?\d+(\.\d+)*).*\"geoid\": \"(?<geoid>\d+).*/) {
        $i++;
        if($j =~ m/.*\"abbreviation\": \"(?<st>\w{2}).*\"violent\": (?<violent>\-?\d+(\.\d+)*).*\"asian\": \"(?<asian>\-?\d+(\.\d+)*).*\"female\": \"(?<female>\-?\d+(\.\d+)*).*\"rape\": (?<rape>\-?\d+(\.\d+)*).*\"native\": \"(?<native>\-?\d+(\.\d+)*).*\"state\": \"(?<sta>.*)\".*\"other\": \"(?<other>\-?\d+(\.\d+)*).*\"black\": \"(?<black>\-?\d+(\.\d+)*).*\"income\": \"(?<income>\-?\d+(\.\d+)*).*\"white\": \"(?<white>\-?\d+(\.\d+)*).*\"murder\": (?<murder>\-?\d+(\.\d+)*).*\"hawaiian\": \"(?<hawaiian>\-?\d+(\.\d+)*).*\"vehicle\": (?<vehicle>\-?\d+(\.\d+)*).*\"assault\": (?<assault>\-?\d+(\.\d+)*).*\"burglary\": (?<burglary>\-?\d+(\.\d+)*).*\"population\": \"(?<population>\d+).*\"county\": \"(?<county>[a-zA-Z\.\s\-\']*).*\"male\": \"(?<male>\-?\d+(\.\d+)*).*\"larceny\": (?<larceny>\-?\d+(\.\d+)*).*\"robbery\": (?<robbery>\-?\d+(\.\d+)*).*\"mixed\": \"(?<multiple>\-?\d+(\.\d+)*).*\"property\": (?<property>\-?\d+(\.\d+)*).*\"geoid\": \"(?<geoid>\d+).*/) {
            $x++;
            $geoid = $+{geoid};
            $state = $+{sta};
            $st = $+{st};
            $county = $+{county};
            $population = $+{population};
            $violent = $+{violent};
            $property = $+{property};
            $murder = $+{murder};
            $rape = $+{rape};
            $robbery = $+{robbery};
            $assault = $+{assault};
            $burglary = $+{burglary};
            $larceny = $+{larceny};
            $vehicle = $+{vehicle};
            #$arson = $+{arson};
            $male = $+{male};
            $female = $+{female};
            $asian = $+{asian};
            $black = $+{black};
            $hawaiian = $+{hawaiian};
            $native = $+{native};
            $white = $+{white};
            $other = $+{other};
            $multiple = $+{multiple};
            $income = $+{income};
            print(STDOUT "$geoid,$state,$st,$county,$population,$violent,$property,$murder,$rape,$robbery,$assault,$burglary,$larceny,$vehicle,$arson,$male,$female,$asian,$black,$hawaiian,$native,$white,$other,$multiple,$income\n");
        }
        else {
            print(STDERR "$j\n");
        }
    }
}
print(STDERR "$x records matched out of $i total records.\n");
# vim: tabstop=8 shiftwidth=4 softtabstop=4 expandtab shiftround autoindent
