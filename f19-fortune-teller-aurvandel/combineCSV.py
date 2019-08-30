#!/usr/bin/env python3

'''
'''

import sys, getopt
import pandas as pd


#Get Command Line Arguments
def main(argv):
    input_file1 = ''
    input_file2 = ''
    output_file = ''
    try:
        opts, args = getopt.getopt(argv,"ha:b:o:",["ifile1=","ifile2","ofile="])
    except getopt.GetoptError:
        print('combineCSV.py -i1 <path to inputfile> -i2 <path to inputfile> -o <path to outputfile>')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print('combineCSV.py -i1 <path to inputfile> -i2 <path to inputfile> -o <path to outputfile>')
            sys.exit()
        elif opt in ("-a", "--ifile1"):
            input_file1 = arg
        elif opt in ("-b", "--ifile2"):
            input_file2 = arg
        elif opt in ("-o", "--ofile"):
            output_file = arg
    combineFiles(input_file1, input_file2, output_file)


def combineFiles(input_file1, input_file2, output_file):
    df1 = pd.read_csv(input_file1)
    df2 = pd.read_csv(input_file2)

    df2 = df2.dropna(axis=1)
    merged = df1.merged = df1.merge(df2, on="name")
    merged.to_csv(output_file, index=False)

if __name__ == "__main__":
   main(sys.argv[1:])

