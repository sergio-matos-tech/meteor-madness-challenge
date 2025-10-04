import math
import sys
import os

# Adjust path to find other modules (like data_services)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the get_asteroid_data function from the nasa_client module
from data_services.nasa_client import get_asteroid_data

def calculate_impact_energy(asteroid_data: dict) -> dict:
    """
    Calculates the kinetic energy and other parameters of an asteroid based on NASA data.
    """
    try:
        # 1. Extract Diameter in meters
        diameters = asteroid_data['estimated_diameter']['meters']
        diameter_min = diameters['estimated_diameter_min']
        diameter_max = diameters['estimated_diameter_max']
        mean_diameter = (diameter_min + diameter_max) / 2
        radius = mean_diameter / 2

        # 2. Calculate Mass in kg 
        # Using the standard density for stony asteroids: 3000 kg/m^3 
        density = 3000
        volume = (4/3) * math.pi * (radius ** 3)
        mass = density * volume

        # 3. Extract Velocity in m/s 
        # The plan calls for selecting the relevant close approach event. For the MVP, we'll take the first one in the list.
        close_approach = asteroid_data['close_approach_data'][0]
        velocity_kms = float(close_approach['relative_velocity']['kilometers_per_second'])
        velocity_ms = velocity_kms * 1000

        # 4. Calculate Kinetic Energy in Joules
        kinetic_energy_joules = 0.5 * mass * (velocity_ms ** 2)

        # 5. Convert to Megatons of TNT
        JOULES_PER_MEGATON = 4.184e15 # 4.184 * 10^15
        energy_megatons_tnt = kinetic_energy_joules / JOULES_PER_MEGATON

        return {
            "mean_diameter_m": mean_diameter,
            "mass_kg": mass,
            "velocity_ms": velocity_ms,
            "kinetic_energy_joules": kinetic_energy_joules,
            "energy_megatons_tnt": energy_megatons_tnt
        }

    except (KeyError, TypeError, IndexError) as e:
        print(f"Error processing asteroid data: Missing key or unexpected format - {e}")
        return None

# Standalone test block for this module
if __name__ == "__main__":
    # Apophis ID, used as an example
    test_asteroid_id = "3542519"
    print(f"--- Starting Energetics Module Test ---")
    data = get_asteroid_data(test_asteroid_id)

    if data:
        energy_results = calculate_impact_energy(data)
        if energy_results:
            print("\n--- Energy Calculation Results ---")
            print(f"Mean Diameter: {energy_results['mean_diameter_m']:.2f} m")
            print(f"Estimated Mass: {energy_results['mass_kg']:.2e} kg")
            print(f"Impact Velocity: {energy_results['velocity_ms']:.2f} m/s")
            print(f"Kinetic Energy: {energy_results['kinetic_energy_joules']:.2e} Joules")
            print(f"Equivalent to: {energy_results['energy_megatons_tnt']:.2f} Megatons of TNT")