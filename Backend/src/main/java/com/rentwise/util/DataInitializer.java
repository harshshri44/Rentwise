package com.rentwise.util;

import com.rentwise.model.Property;
import com.rentwise.model.PropertyContact;
import com.rentwise.model.Role;
import com.rentwise.model.User;
import com.rentwise.repository.PropertyRepository;
import com.rentwise.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PropertyRepository propertyRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProperties();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // Seed Owner Account
            User owner = new User(
                    "Sunita Kulkarni (Owner)",
                    "owner@rentwise.com",
                    passwordEncoder.encode("password123"),
                    "+919823056789",
                    Role.ROLE_OWNER
            );
            userRepository.save(owner);

            // Seed Tenant Account
            User tenant = new User(
                    "Rahul Sharma (Renter)",
                    "renter@rentwise.com",
                    passwordEncoder.encode("password123"),
                    "+919876543210",
                    Role.ROLE_TENANT
            );
            userRepository.save(tenant);

            // Seed Admin Account
            User admin = new User(
                    "RentWise Admin",
                    "admin@rentwise.com",
                    passwordEncoder.encode("admin123"),
                    "+919800000000",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }
    }

    private void seedProperties() {
        if (propertyRepository.count() == 0) {
            List<Property> seedList = List.of(
                    createProp(
                            "prop-1",
                            "Modern Furnished Room Near College",
                            "Pune",
                            "Kothrud",
                            "Near MIT College, Paud Road",
                            "Private Room",
                            "student-friendly",
                            1, 1, 220,
                            8500.0, 15000.0,
                            "Furnished",
                            List.of("Wi-Fi", "Attached Bath", "Geyser", "Study Desk", "Power Backup"),
                            List.of(
                                    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Bright and airy private room available in a quiet residential society right next to MIT College. Comes with high-speed Wi-Fi, personal wardrobe, study table, and attached private washroom. Ideal for students or interns. No broker fee, direct setup.",
                            "Available Immediately", "Immediate",
                            new PropertyContact("Rohan Deshmukh", "+919822011234", "owner@rentwise.com", "Flatmate"),
                            "owner@rentwise.com", "2026-10-14"
                    ),
                    createProp(
                            "prop-2",
                            "Spacious 2 BHK Garden Facing Apartment",
                            "Pune",
                            "Baner",
                            "Balewadi High Street Link Road",
                            "Full Apartment",
                            "apartment",
                            2, 2, 1100,
                            26000.0, 60000.0,
                            "Semi-Furnished",
                            List.of("Covered Parking", "Gated Security", "Lift", "Balcony", "Modular Kitchen", "Power Backup"),
                            List.of(
                                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Well-ventilated 2 BHK apartment on the 4th floor with open garden views. Modular kitchen with chimney, fitted wardrobes in both bedrooms, 2 private balconies, and dedicated covered 4-wheeler parking. Walking distance to Baner High Street cafes and supermarkets.",
                            "Available from 1st Nov", "2026-11-01",
                            new PropertyContact("Sunita Kulkarni", "+919823056789", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-13"
                    ),
                    createProp(
                            "prop-3",
                            "Twin Sharing Room for Students in PG Flat",
                            "Pune",
                            "Viman Nagar",
                            "Near Symbiosis Campus, Datta Mandir Road",
                            "Shared Room",
                            "student-friendly",
                            1, 1, 180,
                            6500.0, 10000.0,
                            "Furnished",
                            List.of("Wi-Fi", "Washing Machine", "Refrigerator", "Power Backup", "Cleaning Service"),
                            List.of(
                                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "1 bed available in a comfortable twin-sharing room in a 3 BHK student flat. Walking distance to Symbiosis Campus. Includes high-speed Wi-Fi, refrigerator, washing machine, maid for daily cleaning, and separate study desks. Safe residential complex with 24/7 security.",
                            "Available Immediately", "Immediate",
                            new PropertyContact("Tanmay Saxena", "+919822456789", "owner@rentwise.com", "Flatmate"),
                            "owner@rentwise.com", "2026-10-12"
                    ),
                    createProp(
                            "prop-4",
                            "Sunlit 1 BHK Flat Near Metro Station",
                            "Pune",
                            "Kalyani Nagar",
                            "Lane 7, Near Joggers Park",
                            "Full Apartment",
                            "apartment",
                            1, 1, 620,
                            18500.0, 40000.0,
                            "Semi-Furnished",
                            List.of("Balcony", "Lift", "Gated Security", "Covered Parking", "Piped Gas"),
                            List.of(
                                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Sunny 1 BHK flat on 3rd floor overlooking green trees in prime Kalyani Nagar. Spacious living room with attached balcony, modular kitchen platform, and 24-hr municipal water supply. Walking distance to Kalyani Nagar Metro station and D-Mart.",
                            "Available from 15th Nov", "2026-11-15",
                            new PropertyContact("Pooja Nair", "+919822987654", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-14"
                    ),
                    createProp(
                            "prop-5",
                            "Shared Flat Bed in 3 BHK High-Rise",
                            "Pune",
                            "Hinjawadi Phase 1",
                            "Near Cognizant & Wipro Circle",
                            "Shared Flat",
                            "shared-flat",
                            3, 3, 1450,
                            9000.0, 18000.0,
                            "Furnished",
                            List.of("Gym", "Swimming Pool", "Wi-Fi", "Power Backup", "Lift", "Covered Parking", "Gated Security"),
                            List.of(
                                    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Looking for a flatmate in a fully furnished 3 BHK apartment in Hinjawadi Phase 1. Master bedroom with attached bathroom available. Society has full clubhouse, gym, pool, tennis courts. Walking distance to Infosys, Wipro, and Cognizant. Chill flatmates.",
                            "Available from 1st Nov", "2026-11-01",
                            new PropertyContact("Amitabh Sen", "+919811223344", "owner@rentwise.com", "Flatmate"),
                            "owner@rentwise.com", "2026-10-11"
                    ),
                    createProp(
                            "prop-6",
                            "Cozy 1 RK with Terrace Access",
                            "Pune",
                            "Aundh",
                            "Near Westend Mall, DP Road",
                            "Studio",
                            "room",
                            1, 1, 300,
                            9500.0, 18000.0,
                            "Semi-Furnished",
                            List.of("Terrace Access", "Geyser", "Wardrobe", "Bike Parking"),
                            List.of(
                                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Quiet 1 RK room on the top floor with direct private terrace access. Includes geyser, ceiling fan, fitted wooden wardrobe, and separate pantry slab. Excellent cross-ventilation. 5 minutes from Westend Mall, Aundh. Ideal for bachelors or working individuals.",
                            "Available Immediately", "Immediate",
                            new PropertyContact("Vijay Joshi", "+919822334455", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-14"
                    ),
                    createProp(
                            "prop-7",
                            "1 BHK Sea-Breeze Flat Near Hiranandani",
                            "Mumbai",
                            "Powai",
                            "Near Powai Lake & IIT Bombay",
                            "Full Apartment",
                            "apartment",
                            1, 1, 550,
                            38000.0, 100000.0,
                            "Furnished",
                            List.of("Air Conditioning", "Modular Kitchen", "Lift", "Gated Security", "Gym", "Power Backup"),
                            List.of(
                                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Modern 1 BHK apartment close to Powai Lake and Hiranandani Business Park. Fitted with split ACs in hall and bedroom, piped gas, washing machine, and double-door fridge. 24-hr security and clubhouse access. Perfect for corporate employees or IIT researchers.",
                            "Available from 15th Nov", "2026-11-15",
                            new PropertyContact("Nisha Singhal", "+919820098765", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-10"
                    ),
                    createProp(
                            "prop-8",
                            "Private Room in Luxury Andheri West Society",
                            "Mumbai",
                            "Andheri West",
                            "Near Lokhandwala Complex",
                            "Private Room",
                            "room",
                            1, 1, 240,
                            22000.0, 45000.0,
                            "Furnished",
                            List.of("Air Conditioning", "Attached Bath", "Wi-Fi", "Balcony", "Gym", "Swimming Pool"),
                            List.of(
                                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Private air-conditioned master bedroom with en-suite luxury bathroom and sunset-view balcony in a 3 BHK high-rise. Located right off Lokhandwala back road. Shared kitchen and living room with two media professionals. Housekeeping included.",
                            "Available Immediately", "Immediate",
                            new PropertyContact("Karan Mehta", "+919820123456", "owner@rentwise.com", "Flatmate"),
                            "owner@rentwise.com", "2026-10-15"
                    ),
                    createProp(
                            "prop-9",
                            "Premium 2 BHK Condo Near Manyata Tech Park",
                            "Bangalore",
                            "Hebbal",
                            "Nagavara Outer Ring Road",
                            "Full Apartment",
                            "apartment",
                            2, 2, 1200,
                            32000.0, 80000.0,
                            "Furnished",
                            List.of("Clubhouse", "Swimming Pool", "Gym", "Covered Parking", "Air Conditioning", "Power Backup"),
                            List.of(
                                    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Executive 2 BHK in gated community directly opposite Manyata Tech Park back gate. 100% power backup, piped gas, covered stilt parking, and olympic-size swimming pool. Zero commute hassle for tech professionals working in North Bangalore.",
                            "Available from 1st Nov", "2026-11-01",
                            new PropertyContact("Ananya Rao", "+919845012345", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-12"
                    ),
                    createProp(
                            "prop-10",
                            "Single Bed in Designer Koramangala 3 BHK",
                            "Bangalore",
                            "Koramangala",
                            "5th Block, Near Jyoti Nivas College",
                            "Shared Room",
                            "student-friendly",
                            1, 1, 190,
                            11500.0, 20000.0,
                            "Furnished",
                            List.of("High Speed Wi-Fi", "Daily Cleaning", "Washing Machine", "Geyser", "Attached Balcony"),
                            List.of(
                                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Bed space in a spacious, sunlit room with twin single beds in Koramangala 5th Block. Surrounded by top cafes, co-working spaces, and gymnasiums. Rent includes electricity up to limit, high-speed fiber internet, and weekly deep cleaning service.",
                            "Available Immediately", "Immediate",
                            new PropertyContact("Siddharth Verma", "+919845198765", "owner@rentwise.com", "Flatmate"),
                            "owner@rentwise.com", "2026-10-14"
                    ),
                    createProp(
                            "prop-11",
                            "Studio Apartment in Gachibowli Financial Hub",
                            "Hyderabad",
                            "Gachibowli",
                            "Near DLF Cyber City & Wipro Circle",
                            "Studio",
                            "room",
                            1, 1, 420,
                            16000.0, 32000.0,
                            "Furnished",
                            List.of("Air Conditioning", "Wi-Fi", "Lift", "Power Backup", "Security/CCTV", "Piped Gas"),
                            List.of(
                                    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Fully furnished self-contained studio flat designed for working IT professionals. Fitted with Queen size bed, work desk, 40-inch Smart TV, microwave, mini-fridge, and split AC. 2 minutes from DLF food street and walking distance to Microsoft and Amazon offices.",
                            "Available from 1st Nov", "2026-11-01",
                            new PropertyContact("Suresh Varma", "+919848011223", "owner@rentwise.com", "Landlord"),
                            "owner@rentwise.com", "2026-10-15"
                    ),
                    createProp(
                            "prop-12",
                            "Spacious Independent Floor in Cyber City Hub",
                            "Delhi NCR",
                            "Cyber City",
                            "DLF Phase 2, Near Sikanderpur Metro",
                            "Full Apartment",
                            "apartment",
                            2, 2, 1250,
                            34000.0, 68000.0,
                            "Furnished",
                            List.of("Air Conditioning", "Covered Parking", "Balcony", "Power Backup", "Security/CCTV"),
                            List.of(
                                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
                                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
                            ),
                            "Tastefully furnished builder floor on 2nd floor with private stilt parking and dual balconies. 300 meters from Sikanderpur Yellow & Rapid Metro interchange. All rooms equipped with 1.5 ton inverter ACs, modular kitchen with chimney and water filter. Ready to move.",
                            "Available from 1st Nov", "2026-11-01",
                            new PropertyContact("Deepak Chaudhary", "+919810012345", "owner@rentwise.com", "Owner"),
                            "owner@rentwise.com", "2026-10-09"
                    )
            );

            propertyRepository.saveAll(seedList);
        }
    }

    private Property createProp(
            String id, String title, String city, String locality, String address,
            String propertyType, String category, int bedrooms, int bathrooms, int areaSqFt,
            double monthlyRent, double securityDeposit, String furnishing,
            List<String> amenities, List<String> photos, String description,
            String availability, String availableDate, PropertyContact contact,
            String ownerEmail, String createdAt
    ) {
        Property p = new Property();
        p.setId(id);
        p.setTitle(title);
        p.setCity(city);
        p.setLocality(locality);
        p.setAddress(address);
        p.setPropertyType(propertyType);
        p.setCategory(category);
        p.setBedrooms(bedrooms);
        p.setBathrooms(bathrooms);
        p.setAreaSqFt(areaSqFt);
        p.setMonthlyRent(monthlyRent);
        p.setSecurityDeposit(securityDeposit);
        p.setFurnishing(furnishing);
        p.setAmenities(amenities);
        p.setPhotos(photos);
        p.setDescription(description);
        p.setAvailability(availability);
        p.setAvailableDate(availableDate);
        p.setContact(contact);
        p.setOwnerEmail(ownerEmail);
        p.setListed(true);
        p.setDemo(false);
        p.setCreatedAt(createdAt);
        return p;
    }
}
