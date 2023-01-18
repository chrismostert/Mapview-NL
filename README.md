![logo](static/logo.png)

# About

Visualize your dataset on a map of The Netherlands for exploratory data analysis purposes. Supports datasets which include a time component and multiple variables which change over time. Loading and processing of the dataset is done in-browser which means that _no data is sent to an external server_.

# Data format

The data should be in `.csv` format and include the following named columns per data point (row):

-   `stat_code`: Municipality code corresponding to the code specified by [CBS](https://www.cbs.nl/nl-nl/onze-diensten/methoden/classificaties/overig/gemeentelijke-indelingen-per-jaar) to which the data point belongs, prefixed by `GM`. For example 'Groningen' would be `GM0014`.
-   `date`: Date corresponding to the data point, in the format `YYYY-MM-DD`.
-   `name`: Name of the variable, which can be filtered in the interface.
-   `value`: Numeric value of the data point.

## Example file

The following file is a (fictitious) dataset which can be loaded in the mapviewer:

```
stat_code,date,name,value
GM0014,2022-11-01,inwoners,10
GM0034,2022-11-01,inwoners,30
GM0034,2022-12-01,inwoners,40
GM0034,2023-01-01,inwoners,20
GM0014,2023-01-01,inwoners,30
GM0096,2022-11-01,inwoners,20
GM0014,2022-11-01,fouten,20
GM0014,2023-01-01,fouten,120
GM0014,2023-02-01,fouten,150
GM0096,2023-02-01,fouten,5
GM0096,2023-02-01,inwoners,500
```

# Map data

The map data belongs to [CBS](https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/cbs-gebiedsindelingen) and has been converted to a [topojson](https://github.com/topojson/topojson) file to decrease the filesize.
