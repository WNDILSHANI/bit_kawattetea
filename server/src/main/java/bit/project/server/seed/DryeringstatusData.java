package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DryeringstatusData extends AbstractSeedClass {

    public DryeringstatusData(){
        addIdNameData(1, "Mr.");
        addIdNameData(2, "Miss");
        addIdNameData(3, "Dr.");
    }

}