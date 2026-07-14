import pandas as pd

fixes = {
    'Lal Quila': (28.6562, 77.2403),
    'Hindon River': (28.6720, 77.4155),
    'Noida Sector 34': (28.5835, 77.3486),
    'Noida Sector 52': (28.5910, 77.3592),
    'Noida Sector 52 [Conn: Aqua]': (28.5910, 77.3592),
    'Noida Sector 61': (28.5956, 77.3639),
    'Noida Sector 59': (28.6015, 77.3739),
    'Noida Sector 62': (28.6148, 77.3629),
    'Noida Sector 144': (28.4883, 77.4526),
    'Noida Sector 145': (28.4839, 77.4601),
    'Noida Sector 146': (28.4776, 77.4722),
    'Noida Sector 147': (28.4735, 77.4811),
    'Mohan Nagar': (28.6784, 77.3837),
    'Shaheed Nagar': (28.6713, 77.3323),
    'Old Faridabad': (28.4069, 77.3105),
    'Sector 28 Faridabad': (28.4239, 77.3117)
}

df = pd.read_csv('datasets/Delhi-Metro-Network.csv')
for name, (lat, lng) in fixes.items():
    df.loc[df['Station Name'] == name, 'Latitude'] = lat
    df.loc[df['Station Name'] == name, 'Longitude'] = lng

df.to_csv('datasets/Delhi-Metro-Network.csv', index=False)
print("CSV coordinates fixed.")
