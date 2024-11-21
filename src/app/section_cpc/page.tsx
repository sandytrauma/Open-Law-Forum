
import ActSectionContent from '@/components/ActSectionContent'; // Adjust the path if necessary
import { fetchActSections } from '@/utils/fetchData'; // Adjust the path if necessary
import { ActSections } from '@/constants/types'; // Adjust the path if necessary

const section_cpc: React.FC = async () => {
  // Change the fileName as needed
  const fileName = 'CPC.json';
  const data: ActSections = await fetchActSections(fileName);

  return (
    <div>
      <h1 className="text-center mt-5 text-teal-800 text-2xl md:text-3xl font-mono font-extrabold">Code of Civil Procedure</h1>
      <ActSectionContent data={data} />
    </div>
  );
};

export default section_cpc;
