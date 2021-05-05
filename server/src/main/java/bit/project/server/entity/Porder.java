package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Porder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate doordered;

    private LocalDate dorequired;

    private LocalDate dorecived;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Porderstatus porderstatus;

    @OneToMany(mappedBy="porder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Porderproduct> porderproductList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "porder")
    private List<Inventory> porderInventoryList;

    @JsonIgnore
    @OneToMany(mappedBy = "porder")
    private List<Packing> porderPackingList;


    public Porder(Integer id){
        this.id = id;
    }

    public Porder(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}