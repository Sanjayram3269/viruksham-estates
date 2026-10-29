import type { Project, ProjectCategory } from "@/types/project";

export type CatalogProject = Project & { catalogOnly: true };

const landProjects = [
  ["gemss-paark-villivalam-walajahbad", "Gemss Paark", "Villivalam, Walajahbad"],
  ["subhiksham-nagar-walajahbad", "Subhiksham Nagar", "Walajahbad"],
  ["subhiksham-nagar-extension-walajahbad", "Subhiksham Nagar Extn.", "Walajahbad"],
  ["ishwaryam-nagar-walajahbad", "Ishwaryam Nagar", "Walajahbad"],
  ["ishwaryam-city-walajahbad", "Ishwaryam City", "Walajahbad"],
  ["anugraham-nagar-walajahbad", "Anugraham Nagar", "Walajahbad"],
  ["sarvamangala-nagar-walajahbad", "Sarvamangala Nagar", "Walajahbad"],
  ["sarvamangala-nagar-extension-walajahbad", "Sarvamangala Nagar Extn.", "Walajahbad"],
  ["sai-nagar-walajahbad", "Sai Nagar", "Walajahbad"],
  ["selvavinayagar-nagar-walajahbad", "Selvavinayagar Nagar", "Walajahbad"],
  ["virukshams-elite-enclave-poosivakkam", "Viruksham's Elite Enclave", "Poosivakkam, Walajahbad"],
  ["virukshams-crown-city-sirumangadu", "Viruksham's Crown City", "Sirumangadu, Sunguvarchathiram"],
] as const;

const constructionProjects = [
  ["shivshakthi-sai-nivas-chitlapakkam", "Shivshakthi Sai Nivas", "Chitlapakkam", "Construction"],
  ["magizh-illam-chitlapakkam", "Magizh Illam", "Chitlapakkam", "Construction"],
  ["vijayalakshmi-illam-iyyappanthangal", "Vijayalakshmi Illam", "Iyyappanthangal", "Construction"],
  ["individual-houses-construction", "Individual Houses Construction", "Chitlapakkam, East Tambaram, West Tambaram, Puzhithivakkam, Selaiyur and Chromepet", "Service"],
  ["commercial-complex-construction", "Commercial Complex Construction", "Chitlapakkam, Tambaram", "Service"],
] as const;

function makeProject(
  slug: string,
  title: string,
  location: string,
  category: ProjectCategory,
): CatalogProject {
  return {
    id: `catalog-${slug}`,
    slug,
    title,
    category,
    status: "UPCOMING",
    location,
    description: "Project-specific information, current status and availability can be confirmed directly with the Viruksham Estates team.",
    availability: "Contact us for current details",
    catalogOnly: true,
  };
}

export const PROJECT_CATALOG: CatalogProject[] = [
  ...landProjects.map(([slug, title, location]) => makeProject(slug, title, location, "PLOTS")),
  ...constructionProjects.map(([slug, title, location, kind]) =>
    makeProject(slug, title, location, "CONSTRUCTION"),
  ),
];

export function getCatalogProject(slug: string) {
  return PROJECT_CATALOG.find((project) => project.slug === slug);
}
