import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',



  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    alignItems: "center",




  },
  gap: {
    marginBottom: 10
  },

});

const PDFPage = ({ asseToPrint, EmployeeInfo }) => {

  console.log(EmployeeInfo);
  console.log(asseToPrint);



  return (

    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>



          <Text style={styles.gap}>Company Name: {EmployeeInfo?.companyName}</Text>
          
          <Text style={styles.gap}>Asset Name: {asseToPrint?.assetName}</Text>
          <Text style={styles.gap}>Asset Type: {asseToPrint?.assetType}</Text>

          <Text style={styles.gap}>Requester Name: {asseToPrint?.requesterName}</Text>
          <Text style={styles.gap}>Requester Email:{asseToPrint?.requesterEmail}</Text>
          <Text style={styles.gap}>Requested Date & Time: {format(new Date(asseToPrint?.requestedDateTime), 'yyyy-MM-dd hh:mm a')}</Text>
          <Text style={styles.gap}>Status: {asseToPrint?.status}</Text>

          <Text style={styles.gap}>Printed Time: {format(new Date(), 'yyyy-MM-dd hh:mm a')}</Text>



        </View>
      </Page>
    </Document>

  );

};

export default PDFPage;